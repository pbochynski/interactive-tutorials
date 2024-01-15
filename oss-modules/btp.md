You can connect this temporary Kubernetes cluster to your BTP subaccount. You need an instance of Service Manager with service_operator_access plan in your subaccount before you attach btp account with:
```
kyma attach
```{{exec}}

When your btp account is attached to the cluster you can also restore services with:
```
kyma restore-services
```{{exec}}