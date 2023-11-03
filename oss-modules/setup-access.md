To connect to the KCP cluster using Kyma Dashboard, follow these steps:

1. Copy the kubeconfig:

```
apiVersion: v1
clusters:
- cluster:
    server: {{TRAFFIC_HOST1_8001}}
  name: kyma-katacoda
contexts:
- context:
    cluster: kyma-katacoda
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    token: tokentokentoken
```{{copy}}

2. Open [Kyma Dashboard](https://dashboard.kyma.cloud.sap), press the  **Connect cluster** button,and paste the kubeconfig in the relevant space. Select **Next step** and **Connect cluster**.
