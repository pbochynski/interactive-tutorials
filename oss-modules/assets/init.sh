kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
kubectl create namespace kyma-system
curl https://kyma-project.github.io/community-modules/busola.tar.gz -o busola.tar.gz
tar -xf busola.tar.gz 
kubectl proxy --api-prefix='/backend/' -w='busola' --www-prefix='' --address='0.0.0.0' --accept-hosts='.*' &
