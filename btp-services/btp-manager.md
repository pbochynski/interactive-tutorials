Install [BTP manager](https://github.com/kyma-project/btp-manager):
```
kubectl apply -f https://github.com/kyma-project/btp-manager/releases/latest/download/btp-manager.yaml
```{{exec}}

Create BTPOperator custom resource
```
kubectl apply -n kyma-system -f https://github.com/kyma-project/btp-manager/releases/latest/download/btp-operator-default-cr.yaml
```{{exec}}

Check the status of installation:
```
kubectl get btpoperator -n kyma-system btpoperator
```{{exec}}
