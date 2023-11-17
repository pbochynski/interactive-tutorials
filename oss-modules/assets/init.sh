kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
kubectl create namespace kyma-system
container_id=$(docker create europe-docker.pkg.dev/kyma-project/prod/busola:latest)
docker cp $container_id:/app/core-ui ./app
curl https://kyma-project.github.io/community-modules/kyma.html -o app/kyma.html

kubectl proxy --api-prefix='/backend/' -w='app' --www-prefix='' --address='0.0.0.0' --accept-hosts='.*' &
