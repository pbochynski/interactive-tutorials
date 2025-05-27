Set cluster id to some generated value using `uuidgen` and base64 encode it. You can also use existing cluster id.
```
export CLUSTER_ID=$(uuidgen)
export CLUSTER_ID_BASE64=$(echo -n $CLUSTER_ID | base64)
```{{exec}}

And now create kubernetes secret out of it:
```
kubectl create ns kyma-system
cat <<EOF > sap-btp-manager-secret.yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: sap-btp-manager
  namespace: kyma-system
  labels:
    app.kubernetes.io/managed-by: kcp-kyma-environment-broker
data:
  clientid: $(jq --raw-output '.clientid | @base64' creds.json)
  clientsecret: $(jq --raw-output '.clientsecret | @base64' creds.json)
  sm_url: $(jq --raw-output '.sm_url | @base64' creds.json)
  tokenurl: $(jq --raw-output '.url | @base64' creds.json)
  cluster_id: ${CLUSTER_ID_BASE64} 
EOF
kubectl apply -f sap-btp-manager-secret.yaml
```{{exec}}

Install [BTP manager](https://github.com/kyma-project/btp-manager):
```
kubectl apply -f https://github.com/kyma-project/btp-manager/releases/latest/download/btp-manager.yaml
kubectl apply -n kyma-system -f https://github.com/kyma-project/btp-manager/releases/latest/download/btp-operator-default-cr.yaml
```{{exec}}


Check the status of installation:
```
kubectl get btpoperator -n kyma-system btpoperator
```{{exec}}

Wait for btpoperator status.state to be `Ready`:
```
kubectl wait --for=condition=Ready --timeout=600s btpoperator -n kyma-system btpoperator
```{{exec}}

Patch sap-btp-service-operator deployment with custom image that supports `soft-delete` and `recovery`:
```
kubectl delete deployment -n kyma-system btp-manager-controller-manager
kubectl patch deployment sap-btp-operator-controller-manager -n kyma-system --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/1/image", "value": "ghcr.io/pbochynski/sap-btp-service-operator/controller:0.7.5-alpha4"}]'
```{{exec}}

Check if sap-btp-operator-controller-manager is restarted:
```
kubectl get pods -n kyma-system
```{{exec}}