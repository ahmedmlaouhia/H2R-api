pipeline {
  agent any
  
  stages {
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
  post {
    always {
      echo 'This will always run' 
      echo 'Deploying H2R...'
      sh 'docker compose --project-name htwor up -d'
      echo 'H2R Deployed'
    }
  }
}
  