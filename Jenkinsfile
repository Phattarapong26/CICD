pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'phattarapong26/cicd'
        DOCKER_TAG = "${BUILD_NUMBER}"
        GIT_REPO = 'https://github.com/Phattarapong26/CICD.git'
        GIT_BRANCH = 'main'
    }
    
    stages {
        stage('Git Clone') {
            steps {
                cleanWs()
                git branch: "${GIT_BRANCH}",
                    url: "${GIT_REPO}",
                    credentialsId: 'git-credentials'
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 20.x') {
                    sh '''
                        echo "Node version: $(node -v)"
                        echo "NPM version: $(npm -v)"
                        npm install --legacy-peer-deps || {
                            echo "Failed to install dependencies. Retrying with --force..."
                            npm install --force
                        }
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 20.x') {
                    sh '''
                        export NODE_OPTIONS="--max-old-space-size=4096"
                        npm run build || {
                            echo "Build failed. Showing error log:"
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
                    sh '''
                        docker --version
                        docker build . -f Dockerfile \
                            -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} \
                            --build-arg NODE_ENV=production \
                            || {
                                echo "Docker build failed. Showing docker build log:"
                                exit 1
                            }
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
} 
