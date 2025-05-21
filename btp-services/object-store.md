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
  externalName: s3-${CLUSTER_ID}
EOF
```{{exec}}


Check the status of the service instance and binding:

```
kubectl get serviceinstance s3
kubectl get servicebinding s3
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

Delete service instance and binding:

```
kubectl delete servicebinding s3
kubectl delete serviceinstance s3
```{{exec}}


Now you can try to list the content of the S3 bucket again, but you should get an error as the credentials are deleted with the service instance and binding. But you can now start this section again and create a new service instance and binding with the same name. The content of the S3 bucket should be restored to the state before the deletion.