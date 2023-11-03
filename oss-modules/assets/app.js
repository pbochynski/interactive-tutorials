var pods = []
var deployment = ''
modules = [
  {
    name: 'serverless',
    operatorDeployment: 'serverless-operator.yaml',

    moduleCRD: {
      group: '',
      version: '',
      kind: ''
    }

  }
]
const URL_PREFIX = '/public/modules/'
function fetchDeployment() {
  url = URL_PREFIX + modules[0].operatorDeployment
  fetch(url).then((response) => response.text()).then((body) => {
    console.log(body)
    deployment = body;
    render()
  })

}

function getPods() {
  fetch('/api/v1/pods')
    .then((response) => response.json())
    .then((podList) => {
      pods = podList.items.sort((a, b) => {
        let cmp = a.metadata.namespace.localeCompare(b.metadata.namespace)
        if (cmp == 0) {
          cmp = a.metadata.name.localeCompare(b.metadata.name)
        }
        return cmp
      })
      render()
    })
}

function renderPods() {
  let html = ''
  pods.forEach(element => {
    html += element.metadata.namespace + ' ' + element.metadata.name + '<br/>'
  });
  document.getElementById('pods').innerHTML = html

}

function renderDeployment() {
  document.getElementById("deployment").innerHTML = deployment
}

function render() {
  renderPods()
  renderDeployment();
}