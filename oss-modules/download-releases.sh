mkdir -p public/modules
kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml -o public/modules/serverless-operator.yaml
kubectl proxy -w='.' -P='/public/' &
