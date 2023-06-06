Configure rate limit service:
```
kubectl apply -f rate-limit-config.yaml
```{{exec}}

Deploy rate limit service:
```
kubectl apply -f rate-limit-service.yaml
```{{exec}}

Configure filters:
```
kubectl apply -f rate-limit-filters.yaml
```{{exec}}

Port forward for ingress gateway: 
```
kubectl port-forward --address=0.0.0.0 -n istio-system svc/istio-ingressgateway 5000:80 &

```{{exec}}

Try this one several times until you get 429 response code:
```
curl http://localhost:5000/headers -iv
```{{exec}}