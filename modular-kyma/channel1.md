Let's suppose that the `cluster-ip` module has a new feature that needs to be tested before it can be released to production. 

To do this, a new ModuleTemplate custom resource (CR) must be created with the specific version of the `cluster-ip` module in the `beta` channel.

To apply this new ModuleTemplate CR, run the following kubectl command:
```
kubectl apply -f cluster-ip-module-template-beta.yaml
```{{exec}}

Check the status of the existing `cluster-ip` module. Make sure it is enabled in the `fast` channel, and that its current version is `v0.0.24`. 
```
kyma alpha list module -k default-kyma
```{{exec}}

Now switch the `cluster-ip` module to the `beta` channel. Run the following command:
```
kyma alpha enable module cluster-ip --channel beta -k default-kyma
```{{exec}}

After switching the module, verify that the `cluster-ip` module is enabled under the `beta` channel and has the new version `v0.0.26`.
```
kyma alpha list module -k default-kyma
```{{exec}}
