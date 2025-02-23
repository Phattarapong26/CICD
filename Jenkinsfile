pipeline {
    agent any

    environment {
        DOCKER_TAG = "${BUILD_NUMBER}"
        GIT_REPO = 'https://github.com/Phattarapong26/CICD.git'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Git Clone') {
            steps {
                // ลบ workspace เก่าถ้ามี
                cleanWs()
                
                // Clone with credentials
                git credentialsId: 'git-credentials',
                    url: "${GIT_REPO}",
                    branch: "${GIT_BRANCH}"
                
                // แสดงข้อมูล Git commit ล่าสุด
                sh """
                    echo "Git commit information:"
                    git log -1
                    echo "Branch: ${GIT_BRANCH}"
                """
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 20.x') {
                    // เพิ่มการแสดง Node.js version และ npm version
                    sh '''
                        echo "Node version: $(node -v)"
                        echo "NPM version: $(npm -v)"
                        npm install --verbose
                    '''
                }
            }
        }

        stage('Type Check') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 20.x') {
                    // เพิ่ม error handling
                    sh '''
                        npm run type-check || {
                            echo "Type check failed. Showing detailed errors:"
                            npm run type-check -- --pretty
                            exit 1
                        }
                    '''
                }
            }
        }

        stage('Lint') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 20.x') {
                    // เพิ่ม error handling และการแสดงผลแบบละเอียด
                    sh '''
                        npm run lint -- --format stylish || {
                            echo "Linting failed. Showing detailed errors:"
                            npm run lint -- --format stylish
                            exit 1
                        }
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 20.x') {
                    // เพิ่ม error handling และการแสดงผล build stats
                    sh '''
                        export NODE_OPTIONS="--max-old-space-size=4096"
                        npm run build || {
                            echo "Build failed. Checking build logs:"
                            cat npm-debug.log || true
                            exit 1
                        }
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // สร้าง build arguments สำหรับ Docker
                    def buildArgs = "--no-cache"
                    
                    // Build Docker image
                    sh """
                        docker build ${buildArgs} \
                            -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} \
                            -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    // Login to Docker registry
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo ${DOCKER_PASS} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USER} --password-stdin
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    // Deploy to development environment
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'dev-server-ssh',
                        keyFileVariable: 'SSH_KEY'
                    )]) {
                        sh """
                            ssh -i ${SSH_KEY} dev-server "
                                docker stop ${DOCKER_IMAGE}-dev || true
                                docker rm ${DOCKER_IMAGE}-dev || true
                                docker run -d --name ${DOCKER_IMAGE}-dev \
                                    -p 3000:3000 \
                                    ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            "
                        """
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                // ขอการยืนยันก่อน deploy to production
                input message: 'Deploy to production?'
                
                script {
                    // Deploy to production environment
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'prod-server-ssh',
                        keyFileVariable: 'SSH_KEY'
                    )]) {
                        sh """
                            ssh -i ${SSH_KEY} prod-server "
                                docker stop ${DOCKER_IMAGE}-prod || true
                                docker rm ${DOCKER_IMAGE}-prod || true
                                docker run -d --name ${DOCKER_IMAGE}-prod \
                                    -p 80:80 \
                                    ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            "
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // เพิ่มการเก็บ log files
            archiveArtifacts artifacts: 'npm-debug.log,build/**/*', allowEmptyArchive: true
            // Cleanup
            sh 'docker logout ${DOCKER_REGISTRY}'
            cleanWs()
        }
        success {
            // Notification on success
            slackSend(
                color: 'good',
                message: "Pipeline succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
            )
        }
        failure {
            // Notification on failure
            slackSend(
                color: 'danger',
                message: "Pipeline failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
            )
        }
    }
} 
