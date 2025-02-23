pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'clients'
        DOCKER_TAG = 'latest'
        GIT_REPO = 'https://github.com/Phattarapong26/CICD.git'
        GIT_BRANCH = 'main'
    }
    
    tools {
        nodejs 'Node 20.x'
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
    }

    post {
        always {
            cleanWs()
        }
    }
} 
