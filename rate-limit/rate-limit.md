Install httpbin service in the default namespace with istio enabled:
```
kubectl label namespace default istio-injection=enabled
kubectl apply -f httpbin.yaml 
```{{exec}}

Forward `istio-ingressgateway` to port 5000:
```
kubectl port-forward --address=0.0.0.0 -n istio-system svc/istio-ingressgateway 5000:80 &

```{{exec}}

Check if httpbin endpoints are available (without rate limiting):
```
curl http://localhost:5000/get
```{{exec}}

Configure and deploy rate limit service (you can switch to editor tab, navigate to deployments folder and inspect those files content):
```
kubectl apply -f rate-limit-config.yaml
kubectl apply -f rate-limit-service.yaml
kubectl apply -f rate-limit-filters.yaml
```{{exec}}

Wait a little bit until rate limit service is up and running.
```
kubectl wait --for condition=Available  deployment/ratelimit
```{{exec}}

Now you can try to reach the limit for different tenants. Repeat the curl commands below until you get 429 response code. Check the configuration in the `rate-limit-config.yaml`.

Tenant `foo` (3 req/minute):
```
curl -H "tenant: foo" http://localhost:5000/headers -iv
```{{exec}}

Tenant `bar` (3 req/minute):
```
curl -H "tenant: bar" http://localhost:5000/headers -iv
```{{exec}}

Tenant `vip` (10 req/minute):
```
curl -H "tenant: vip" http://localhost:5000/headers -iv
```{{exec}}

Tenant `demo` (unlimited):
```
curl -H "tenant: demo" http://localhost:5000/headers -iv
```{{exec}}