kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.18.0 sh -
cd istio-1.18.0
export PATH=$PWD/bin:$PATH
cd ~/deployments
istioctl install -f ~/deployments/istio-profile.yaml -y
echo 'Prerequisites are already installed. You can move to the next page'