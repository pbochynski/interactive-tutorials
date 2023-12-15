Open this [link]({{TRAFFIC_HOST1_8001}}/static/)

Or you can deploy kyma-modules-ui in your cluster:
```
kubectl run ui --image=ghcr.io/kyma-project/community-modules:main
```{{exec}}

Then start `kubectl proxy` command (it is already started in this tutorial)
And access the ui through kubectl proxy:
[http://localhost:8001/api/v1/namespaces/default/pods/ui/proxy/]({{TRAFFIC_HOST1_8001}}/api/v1/namespaces/default/pods/ui/proxy)

