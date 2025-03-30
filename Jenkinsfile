pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'clients'
        DOCKER_TAG = 'latest'
        GIT_REPO = 'https://github.com/Phattarapong26/CICD.git'
        GIT_BRANCH = 'main'
        PATH = "/usr/local/bin:${env.PATH}"
        APP_PORT = '5000'
        ROBOT_REPORTS_DIR = 'robot-reports'
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

        stage('Check Node') {
            steps {
                sh '''
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install
                    python3 -m pip install robotframework robotframework-seleniumlibrary
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    sh """
                        docker build --pull --rm -f 'Dockerfile' \
                            -t '${DOCKER_IMAGE}:${DOCKER_TAG}' .
                    """
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh """
                        docker stop ${DOCKER_IMAGE} || true
                        docker rm ${DOCKER_IMAGE} || true
                        
                        docker run -d \
                            --name ${DOCKER_IMAGE} \
                            -p ${APP_PORT}:80 \
                            --restart unless-stopped \
                            ${DOCKER_IMAGE}:${DOCKER_TAG}
                            
                        echo "แอปพลิเคชันกำลังทำงานที่พอร์ต ${APP_PORT}"
                        echo "คุณสามารถเข้าถึงได้ที่ http://localhost:${APP_PORT}"
                    """
                }
            }
        }

        stage('Run Robot Tests') {
            steps {
                script {
                    sh """
                        mkdir -p ${ROBOT_REPORTS_DIR}
                        python3 -m robot --outputdir ${ROBOT_REPORTS_DIR} TestCase.robot
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline สำเร็จ! แอปพลิเคชันกำลังทำงานที่ http://localhost:${APP_PORT}"
            echo "รายงานการทดสอบ Robot Framework อยู่ในโฟลเดอร์ ${ROBOT_REPORTS_DIR}"
        }
        failure {
            echo "Pipeline ล้มเหลว! กรุณาตรวจสอบบันทึกเพื่อดูรายละเอียด"
        }
        always {
            cleanWs()
        }
    }
} 
