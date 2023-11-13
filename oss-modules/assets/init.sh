kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
kubectl create namespace kyma-system
curl https://kyma-project.github.io/community-modules/kyma.html -o kyma.html

kubectl proxy -w='.' --address='0.0.0.0' --accept-hosts='.*' &
