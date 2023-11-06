mkdir -p assets/modules
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml -o assets/modules/serverless-operator.yaml
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/default-serverless-cr.yaml -o assets/modules/default-serverless-cr.yaml
curl -L https://github.com/kyma-project/istio/releases/latest/download/istio-manager.yaml -o assets/modules/istio-manager.yaml
curl -L https://github.com/kyma-project/istio/releases/latest/download/istio-default-cr.yaml -o assets/modules/istio-default-cr.yaml
sleep 2 && open http://127.0.0.1:8001/assets
kubectl proxy -w='assets' -P='/assets/'
