Create a service instance for S3 with soft delete and recovery enabled and create a service binding for it. 

```
cat <<EOF | kubectl apply -f -
apiVersion: services.cloud.sap.com/v1
kind: ServiceInstance
metadata:
  name: s3
  labels:
    services.cloud.sap.com/soft-delete: 'true'
    services.cloud.sap.com/recover: 'true'
spec:
  serviceOfferingName: objectstore
  servicePlanName: standard
---
apiVersion: services.cloud.sap.com/v1
kind: ServiceBinding
metadata:
  name: s3
spec:
  serviceInstanceName: s3
  secretName: s3
EOF
```{{exec}}


Check the status of the service instance and binding:

```
kubectl get serviceinstance s3
kubectl get servicebinding s3
```{{exec}}


Install the AWS S3 CLI:

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip >/dev/null 2>&1
sudo ./aws/install >/dev/null 2>&1
rm -rf awscliv2.zip
```{{exec}}

Configure the AWS CLI with the credentials from the service binding:

```
aws configure set aws_access_key_id $(kubectl get secret s3 -o jsonpath='{.data.access_key_id}' | base64 --decode)
aws configure set aws_secret_access_key $(kubectl get secret s3 -o jsonpath='{.data.secret_access_key}' | base64 --decode)
aws configure set region $(kubectl get secret s3 -o jsonpath='{.data.region}' | base64 --decode)
BUCKET=$(kubectl get secret s3 -o jsonpath='{.data.bucket}' | base64 --decode)
```{{exec}}

Create a file with timestamp in the name and upload it to the S3 bucket:

```
echo "Hello world" > hello.txt
aws s3 cp hello.txt s3://$BUCKET/hello-$(date +%Y-%m-%dT%H:%M:%S).txt
```{{exec}}
Check the content of the S3 bucket:

```
aws s3 ls s3://$BUCKET/
```{{exec}}