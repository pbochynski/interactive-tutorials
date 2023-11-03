mkdir -p assets/modules
kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml -o assets/modules/serverless-operator.yaml
kubectl proxy -w='assets' -P='/assets/' --address='0.0.0.0' --accept-hosts='.*' &
