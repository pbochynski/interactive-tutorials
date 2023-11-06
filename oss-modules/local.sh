sleep 2 && open http://127.0.0.1:8001/assets
kubectl proxy -w='assets' -P='/assets/'
