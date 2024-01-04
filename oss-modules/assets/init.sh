kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
kubectl create namespace kyma-system
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source .bashrc
nvm install 21.5
npm install -g kyma
