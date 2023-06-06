kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.17.2 sh -
cd istio-1.17.2
export PATH=$PWD/bin:$PATH
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
kubectl apply -f samples/httpbin/httpbin.yaml 
kubectl apply -f samples/httpbin/httpbin-gateway.yaml 
echo 'Prerequisites are already installed. You can move to the next page'