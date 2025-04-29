curl -s -0L -H 'cookie: eula_3_2_agreed=tools.hana.ondemand.com/developer-license-3_2.txt' https://tools.hana.ondemand.com/additional/btp-cli-linux-amd64-2.83.0.tar.gz -o btp-cli.tar.gz
tar -vxzf btp-cli.tar.gz
mv linux-amd64/btp /usr/local/bin
kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-

