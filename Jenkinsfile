pipeline {
  agent any
  
  stages {
    stage ('testing'){
      when {
        branch "devops"
      }
      steps {
        echo 'testing ...'
        sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                nvm use 21
                npm install
                '''
        sh 'npm test'
        sh ''
      }
    }
    stage('login to ecr') {
      when {
        branch "devops"
      }
      steps {
        echo 'logging in ...'
        sh 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 381491905102.dkr.ecr.us-east-1.amazonaws.com'
        }
      }
    

    stage('building docker image') {
      when {
        branch "devops"
      }
      steps {
        echo 'building ...'
        sh 'docker build -t bohmid/h2r-backend:v1 .'
      }
    }

    stage('tagging image') {
      when {
        branch "devops"
      }
      steps {
        echo 'tagging ...'
        sh 'docker tag bohmid/h2r-backend:v1 381491905102.dkr.ecr.us-east-1.amazonaws.com/bohmid/h2r-backend:v1'
      }
    }

    stage('pushing image') {
      when {
        branch "devops"
      }
      steps {
        echo 'pushing to registry ...'
        sh 'docker push 381491905102.dkr.ecr.us-east-1.amazonaws.com/bohmid/h2r-backend:v1'
      }
    }
  }
}
  