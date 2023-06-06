kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.17.2 sh -
cd istio-1.17.2
export PATH=$PWD/bin:$PATH
cp samples/httpbin/httpbin.yaml ~/deployments
cp samples/httpbin/httpbin-gateway.yaml ~/deployments
cp samples/ratelimit/rate-limit-service.yaml ~/deployments
cd ~/deployments
istioctl install -f ~/deployments/istio-profile.yaml -y
kubectl label namespace default istio-injection=enabled
kubectl apply -f httpbin.yaml 
kubectl apply -f httpbin-gateway.yaml 
echo 'Prerequisites are already installed. You can move to the next page'