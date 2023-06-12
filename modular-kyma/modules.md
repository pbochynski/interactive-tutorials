Now you can enable modules in Kyma Dashboard. To do that, go to the `kyma-system` Namespace, in the **Kyma** section open the Kyma custom resource (CR), edit it and add `cluster-ip` module from the beta channel.

Alternatively, you can list all the available modules in the cluster using Kyma CLI:
```
kyma alpha list module
```{{exec}}

To check which modules are currently enabled in your cluster, pass the reference to a valid Kyma CR:

```
kyma alpha list module -k default-kyma
```{{exec}}


If you prefer to use the CLI also for enabling/disabling modules, run the following command:
```
kyma alpha enable module cluster-ip --channel fast --wait
```{{exec}}

Now you can verify if the cluster IP module is already available:
```
kubectl get clusterip -n kyma-system clusterip-nodes -oyaml
```{{exec}}
