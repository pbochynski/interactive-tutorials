var pods = []
var CRDs = []
var deployment = ''

modules = [
  {
    name: 'serverless',
    deploymentYaml: 'serverless-operator.yaml',
    deployment: [],
    crd: {
      group: 'operator.kyma-project.io',
      version: 'v1alpha1',
      resource: 'serverlesses',
      kind: 'Serverless'
    },
    status: 'unknown'

  }
]
const URL_PREFIX = '/assets/modules/'

function deploymentList(l) {
  let html='<ul>'
  for (let i of l) {
    html+=`<li>${i.metadata.name} (${i.kind})</li>`
  }
  return html+'</ul>'
}
function moduleCard(m) {
  let card = document.createElement("div")
  let html = `<small>
    name: <b>${m.name}</b><br/>
    deployment: <b>${m.deploymentYaml}</b><br/>
    status: <b>${m.status}</b><br/>
    resources: ${deploymentList(m.deployment)}<br/>`
    
  card.innerHTML = html
  return card
}

function crdList() {
  fetch(`/apis/apiextensions.k8s.io/v1/customresourcedefinitions`)
    .then((r) => r.json())
    .then((body) => {
      CRDs = body.items
      loadModules()
    })
}


function checkModules() {
  for (let m of modules) {
    fetch(`/apis/${m.crd.group}/${m.crd.version}/${m.crd.resource}`).then((res) => {
      m.status = res.statusText
      renderModules()
    })
  }

}
function renderModules() {
  let div = document.getElementById('modules');
  div.innerHTML = ""
  for (let m of modules) {
    div.appendChild(moduleCard(m))
  }
}

function loadModules() {
  for (let m of modules) {
    let url = URL_PREFIX + m.deploymentYaml
    fetch(url).then((response) => response.text()).then((body) => {
      console.log(body)
      m.deployment = []
      jsyaml.loadAll(body, (doc) => {
        m.deployment.push(doc)

      });
    })
  }
  checkModules()
}
function fetchDeployment() {
  let url = URL_PREFIX + modules[0].deployment
  fetch(url).then((response) => response.text()).then((body) => {
    console.log(body)
    deployment = []
    jsyaml.loadAll(body, (doc) => {
      deployment.push(doc)
    });
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
  document.getElementById("deployment").innerHTML = JSON.stringify(deployment, null, 2)
}

function render() {
  renderPods()
  renderDeployment();
  renderModules();
}

crdList()