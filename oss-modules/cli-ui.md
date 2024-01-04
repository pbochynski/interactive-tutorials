
Check available kyma modules:
```
kyma modules
```{{exec}}

You can install some of them:
```
kyma deploy -m istio api-gateway --defaultConfig
```{{exec}}

And you can open the UI:
```
kyma ui
```{{exec}}

And access the ui through kubectl proxy:
[Kyma UI]({{TRAFFIC_HOST1_3000}}?api=backend)

