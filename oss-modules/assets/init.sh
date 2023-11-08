kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
kubectl create namespace kyma-system
kubectl proxy -w='assets' -P='/assets/' --address='0.0.0.0' --accept-hosts='.*' &
