mkdir -p assets/modules
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml -o assets/modules/serverless-operator.yaml
sleep 2 && open http://127.0.0.1:8001/assets
kubectl proxy -w='assets' -P='/assets/'
