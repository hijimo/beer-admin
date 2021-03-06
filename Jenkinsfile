def label = "slave-${UUID.randomUUID().toString()}"

podTemplate(label: label, containers: [
  containerTemplate(name: 'node', image: 'registry-vpc.cn-shanghai.aliyuncs.com/ucharm/node:12.13-alpine', command: 'cat', ttyEnabled: true),
  containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
  containerTemplate(name: 'kubectl', image: 'registry-vpc.cn-shanghai.aliyuncs.com/ucharm/helm-kubectl', command: 'cat', ttyEnabled: true),
  containerTemplate(name: 'helm', image: 'registry-vpc.cn-shanghai.aliyuncs.com/ucharm/helm-kubectl', command: 'cat', ttyEnabled: true)
], volumes: [
  hostPathVolume(mountPath: '/root/.kube', hostPath: '/root/.kube'),
  hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
]) {
  node(label) {
    def myRepo = checkout scm
    def gitCommit = myRepo.GIT_COMMIT
    def gitBranch = myRepo.GIT_BRANCH

    def imageTag = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()

    stage('单元测试') {
      echo "测试阶段"
    }
    stage('编译打包') {
      try {  
        container('node') {
            echo "代码编译打包阶段"
            sh """
              git submodule update --init --recursive
              yarn && PUBLISH_ENV=production yarn run build
            """
        }
      } catch (exc) {
          println "构建失败 - ${currentBuild.fullDisplayName}"
          throw(exec)
      }
    }
    stage('构建镜像') {
        withCredentials([usernamePassword(credentialsId: 'DockerHub', passwordVariable: 'HubPassword', usernameVariable: 'HubUser')]) {
            container('docker') {
                echo "构建 Docker 镜像阶段"
                sh """
                  docker login --username=${HubUser} --password=${HubPassword} ${CONTAINER_REGISTRY}
                  docker build -t ${CONTAINER_REGISTRY}/yeeorder/${APPNAME}:${BUILD_ID}-${imageTag} .
                  docker push ${CONTAINER_REGISTRY}/yeeorder/${APPNAME}:${BUILD_ID}-${imageTag}
                """
            }
        }
    }
    stage('运行 Kubectl') {
      container('kubectl') {
        echo "查看 K8S 集群 Pod 列表"
        sh """
          kubectl version && kubectl get pods
          sed -i 's/<APPNAME>/${APPNAME}/' deployment.yaml
          sed -i 's/<NAMESPACE-NAME>/${NAMESPACE}/' deployment.yaml
          sed -i 's/<CONTAINER_REGISTRY>/${CONTAINER_REGISTRY}/' deployment.yaml
          sed -i 's/<BUILD_TAG>/${BUILD_ID}-${imageTag}/' deployment.yaml
          kubectl -n ${NAMESPACE} apply -f deployment.yaml
        """
      }
    }
    stage('运行 Helm') {
      container('helm') {
        echo "查看 Helm Release 列表"
        sh "helm version && helm list"
      }
    }
  }
}