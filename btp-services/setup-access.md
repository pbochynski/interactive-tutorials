You can connect to this cluster from Kyma Dashboard. You just need to open 
open proxy to the kubernetes API server:
```
kubectl proxy --address='0.0.0.0' --accept-hosts='.*' &
```{{execute}}

Copy the kubeconfig:
```
apiVersion: v1
clusters:
- cluster:
    server: {{TRAFFIC_HOST1_8001}}
  name: kyma-killerkoda
contexts:
- context:
    cluster: kyma-killerkoda
    user: admin
  name: killerkoda
current-context: killerkoda
kind: Config
preferences: {}
users:
- name: admin
  user:
    token: tokentokentoken
```{{copy}}

Paste it in the [Kyma Dashboard](https://dashboard.kyma.cloud.sap) (Connect cluster button)