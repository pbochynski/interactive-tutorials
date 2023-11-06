mkdir -p assets/modules
kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml -o assets/modules/serverless-operator.yaml
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/default-serverless-cr.yaml -o assets/modules/default-serverless-cr.yaml
curl -L https://github.com/kyma-project/istio/releases/latest/download/istio-manager.yaml -o assets/modules/istio-manager.yaml
curl -L https://github.com/kyma-project/istio/releases/latest/download/istio-default-cr.yaml -o assets/modules/istio-default-cr.yaml
kubectl proxy -w='assets' -P='/assets/' --address='0.0.0.0' --accept-hosts='.*' &
