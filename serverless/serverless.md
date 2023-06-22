Create kyma-system namespace:
```
kubectl create ns kyma-system
```{{exec}}

Install serverless manager:
```
kubectl apply -f https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-manager.yaml
```{{exec}}

And create serverless instance:
```
cat <<EOF | kubectl apply -n kyma-system -f -
apiVersion: operator.kyma-project.io/v1alpha1
kind: Serverless
metadata:
  name: serverless-sample
spec:
  dockerRegistry:
    enableInternal: true
EOF
```{{exec}}

Check the status of the serverless instance:
```
kubectl get serverless serverless-sample -n kyma-system -oyaml
```{{exec}}

Create sample function that calculates random Fibonacci series:
```
kubectl apply -f https://raw.githubusercontent.com/kwiatekus/serverless-keda-demo/main/demo-app/fibo-fn.yaml
```{{exec}}

Wait for function to be in the Running status:
```
kubectl wait --for condition=Running  functions/fibo-fn
```{{exec}}

Expose the function on port 8080
```
kubectl port-forward service/fibo-fn 8080:80 --address=0.0.0.0 &
```{{exec}}

And you can access it from your browser: {{TRAFFIC_HOST1_8080}}
