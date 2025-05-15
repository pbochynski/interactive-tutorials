Login to your BTP account and select the subaccount you want to use:
```
btp set config --format json --target.hierarchy false --login.sso manual
btp login --url https://cpcli.cf.eu10.hana.ondemand.com --sso manual
btp target
SUBACCOUNT_SUBDOMAIN=$(btp get account/subaccount | jq -r '.subdomain')
```{{exec}}

Copy the login URL, paste it in another browser window/tab and log in to your BTP account.

After successful login you can find service instance `service-operator-access` with plan `service-operator-access` in your subaccount. If you don't have it, create it with the following command:
```
SM_PLAN=$(btp list services/plan | jq -r '
  ( [ .[] | select(.name=="service-operator-access" and .service_offering_name=="service-manager") | .id ] | .[0] ) // empty
')

SOA_INSTANCE=$(btp list service/instance | jq --arg plan_id_var "$SM_PLAN" -r '
  ( [ .[] | select(.service_plan_id == $plan_id_var) | .id ] | .[0] ) // empty
')

if [ -z "$SOA_INSTANCE" ]; then
  echo "Service instance 'service-operator-access' with plan ID '$SM_PLAN' not found. Creating..."

  btp create service/instance --name service-operator-access --plan-name service-operator-access --offering-name service-manager

  SOA_INSTANCE=$(btp list service/instance | jq --arg plan_id_var "$SM_PLAN" -r '
    ( [ .[] | select(.service_plan_id == $plan_id_var) | .id ] | .[0] ) // empty
  ')

  if [ -z "$SOA_INSTANCE" ]; then
    echo "Error: Failed to get service instance ID after creation."
    exit 1
  fi
  echo "Created and found service instance: ${SOA_INSTANCE}"
else
  echo "Service instance already exists: ${SOA_INSTANCE}"
fi
```{{exec}}

Now get the credentials for the service instance. If you don't have any binding yet, create one:
```
BINDING_CREDENTIALS=$(btp list service/binding --fields-filter "service_instance_id eq '${SOA_INSTANCE}'" | jq -r '
  (.[0]?.credentials) // empty
')
if [ -z "$BINDING_CREDENTIALS" ]; then
  echo "No binding found for service instance ${SOA_INSTANCE}, creating one..."
  btp create service/binding \
    --name service-operator-access-binding \
    --service-instance "${SOA_INSTANCE}" 
fi
echo "Saving to creds.json"
btp list service/binding --fields-filter "service_instance_id eq '${SOA_INSTANCE}'" | jq -r '(.[0]?.credentials) // empty' > creds.json
```{{exec}}

The credentials are saved in `creds.json` file. You can use them to create a secret in your cluster:
```
cat creds.json | jq -r '.'
```{{exec}}

