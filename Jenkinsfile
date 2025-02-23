pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'clients'
        DOCKER_TAG = 'latest'
        GIT_REPO = 'https://github.com/Phattarapong26/CICD.git'
        GIT_BRANCH = 'main'
        PATH = "/usr/local/bin:${env.PATH}"
        APP_PORT = '3000'
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
                sh 'npm install'
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
                            
                        echo "Application is running on port ${APP_PORT}"
                        echo "You can access it at http://localhost:${APP_PORT}"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! Application is running at http://localhost:${APP_PORT}"
        }
        failure {
            echo "Pipeline failed! Check the logs for details"
        }
        always {
            cleanWs()
        }
    }
} 
