Create Service Manager instance (you need it to get credentials you can use in your cluster without being logged in with our user):
```
btp create services/instance --subaccount $SUBACCOUNT --service myservicemanager --plan-name service-operator-access --offering-name service-manager
```{{exec}}

And the binding (binding contains actual credentials):
```
btp create services/binding --subaccount $SUBACCOUNT --name smbinding --instance-name myservicemanager
```{{exec}}

Check if binding has ready property set to true:
```
btp --format json  get services/binding --name smbinding --subaccount $SUBACCOUNT | jq
```{{exec}}

Create `creds.json` file from binding:
```
btp --format json  get services/binding --name smbinding --subaccount $SUBACCOUNT | jq -r '.credentials' >creds.json
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
  cluster_id: dGVzdF9jbHVzdGVyX2lk
EOF
kubectl apply -f sap-btp-manager-secret.yaml
```{{exec}}
