# Install BTP CLI
curl -s -0L -H 'cookie: eula_3_2_agreed=tools.hana.ondemand.com/developer-license-3_2.txt' https://tools.hana.ondemand.com/additional/btp-cli-linux-amd64-2.83.0.tar.gz -o btp-cli.tar.gz
tar -vxzf btp-cli.tar.gz
mv linux-amd64/btp /usr/local/bin
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip >/dev/null 2>&1
sudo ./aws/install >/dev/null 2>&1
rm -rf awscliv2.zip


# Install Kyma CLI
# VERSION=$(curl -sL https://api.github.com/repos/kyma-project/cli/releases | jq -r 'map(select(.tag_name!="0.0.0-dev")) | first | .tag_name')
# echo "downloading ${VERSION} release..."
# curl -sL "https://github.com/kyma-project/cli/releases/download/${VERSION}/kyma_$(uname -s)_$(uname -m).tar.gz" -o cli.tar.gz
# tar -zxvf cli.tar.gz kyma
# mv kyma /usr/local/bin/kyma

# Install SM CLI
# curl -sL https://github.com/Peripli/service-manager-cli/releases/download/1.12.1/smctl-1.12.1-linux-amd64.tar.gz -o smctl.tar.gz
# tar -xvf smctl.tar.gz
# mv smctl /usr/local/bin/smctl

kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
touch creds.json
