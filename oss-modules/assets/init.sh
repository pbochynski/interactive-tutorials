kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
kubectl create namespace kyma-system
curl https://kyma-project.github.io/community-modules/kyma.html -o kyma.html
curl https://kyma-project.github.io/community-modules/app.js -o app.js
curl https://kyma-project.github.io/community-modules/logo.svg -o logo.svg

kubectl proxy -w='.' --address='0.0.0.0' --accept-hosts='.*' &
