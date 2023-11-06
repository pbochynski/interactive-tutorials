mkdir -p assets/modules
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml -o assets/modules/serverless-operator.yaml
curl -L https://github.com/kyma-project/serverless-manager/releases/latest/download/default-serverless-cr.yaml -o assets/modules/default-serverless-cr.yaml
curl -L https://github.com/kyma-project/istio/releases/latest/download/istio-manager.yaml -o assets/modules/istio-manager.yaml
curl -L https://github.com/kyma-project/istio/releases/latest/download/istio-default-cr.yaml -o assets/modules/istio-default-cr.yaml
curl -L https://github.com/kyma-project/btp-manager/releases/latest/download/btp-manager.yaml -o assets/modules/btp-manager.yaml
curl -L https://github.com/kyma-project/btp-manager/releases/latest/download/btp-operator-default-cr.yaml -o assets/modules/btp-operator-default-cr.yaml
curl -L https://github.com/kyma-project/telemetry-manager/releases/latest/download/telemetry-manager.yaml -o assets/modules/telemetry-manager.yaml
curl -L https://github.com/kyma-project/telemetry-manager/releases/latest/download/telemetry-default-cr.yaml -o assets/modules/telemetry-default-cr.yaml
curl -L https://github.com/kyma-project/nats-manager/releases/latest/download/nats-manager.yaml -o assets/modules/nats-manager.yaml
curl -L https://github.com/kyma-project/nats-manager/releases/latest/download/nats_default_cr.yaml -o assets/modules/nats_default_cr.yaml
curl -L https://github.com/kyma-project/keda-manager/releases/latest/download/keda-manager.yaml -o assets/modules/keda-manager.yaml
curl -L https://github.com/kyma-project/keda-manager/releases/latest/download/keda-default-cr.yaml -o assets/modules/keda-default-cr.yaml

sleep 2 && open http://127.0.0.1:8001/assets
kubectl proxy -w='assets' -P='/assets/'
