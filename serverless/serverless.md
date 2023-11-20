Create kyma-system namespace:
```
kubectl create ns kyma-system
```{{exec}}

Install serverless manager:
```
kubectl apply -f https://github.com/kyma-project/serverless-manager/releases/latest/download/serverless-operator.yaml
```{{exec}}

And create serverless instance with default configuration:
```
kubectl apply -n kyma-system -f https://github.com/kyma-project/serverless-manager/releases/latest/download/default-serverless-cr.yaml
```{{exec}}

Check the status of the serverless instance:
```
kubectl get serverless default -n kyma-system -oyaml
```{{exec}}

Create sample function `Hello World` function 
```
cat <<EOF | kubectl apply -f -
apiVersion: serverless.kyma-project.io/v1alpha2
kind: Function
metadata:
  name: hello
spec:
  runtime: nodejs18
  source:
    inline:
      source: |
        module.exports = {
          main: function(event, context) {
            return 'Hello World!'
          }
        }
  resourceConfiguration:
    function:
      resources:
        requests:
          cpu: 100m
          memory: 100Mi
    build:
      resources:
        requests:
          cpu: 200m
          memory: 256Mi
EOF
```{{exec}}

Wait for function to be in the Running status:
```
kubectl wait --for condition=Running  functions/hello
```{{exec}}

Expose the function on port 8080
```
kubectl port-forward service/fibo-fn 8080:80 --address=0.0.0.0 &
```{{exec}}

And you can access it from your browser: {{TRAFFIC_HOST1_8080}}
