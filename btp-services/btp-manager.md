Install [BTP manager](https://github.com/kyma-project/btp-manager):
```
kubectl apply -f https://github.com/kyma-project/btp-manager/releases/latest/download/rendered.yaml
```{{exec}}

Create BTPOperator custom resource
```
cat <<EOF | kubectl apply -f -
apiVersion: operator.kyma-project.io/v1alpha1
kind: BtpOperator
metadata:
  name: btpoperator-sample
  namespace: kyma-system
EOF
```{{exec}}

Check the status of installation:
```
kubectl get btpoperator -n kyma-system btpoperator-sample
```{{exec}}
