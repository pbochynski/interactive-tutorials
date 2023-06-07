Welcome to modular Kyma!

In this interactive tutorial, you will learn how to enable Kyma modules and use them in your cluster! You will also learn how to easily interact with the modules both in the terminal and in [Kyma Dashboard](https://dashboard.kyma.cloud.sap/clusters), our UI for your Kyma experience.

For your convenience, we are now preparing your very own Kyma Control Plane (KCP) installed using our [CLI](https://github.com/kyma-project/cli).

KCP includes a deployment of [Lifecycle Manager](https://github.com/kyma-project/lifecycle-manager) that is already preconfigured. We also apply some special cluster privileges to it so that you can work with your modules without any issues, so enjoy!

For more details on what is happening in KCP, you can always run `kyma alpha deploy --help`. The command lists many options to kustomize your deployment which you can use in your testing environment outside of this interactive tutorial.

For now, wait until Kyma Control Plane with Lifecycle Manager is installed.
