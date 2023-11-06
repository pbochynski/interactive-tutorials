var pods = []
var groupVersions = {}

var modules = [
  {
    name: 'istio',
    deploymentYaml: 'istio-manager.yaml',
    crYaml: 'istio-default-cr.yaml'
  },
  {
    name: 'api-gateway',
    deploymentYaml: 'api-gateway-manager.yaml',
    crYaml: 'apigateway-default-cr.yaml'
  },
  {
    name: 'serverless',
    deploymentYaml: 'serverless-operator.yaml',
    crYaml: 'default-serverless-cr.yaml'
  },
  {
    name: 'btp-operator',
    deploymentYaml: 'btp-manager.yaml',
    crYaml: 'btp-operator-default-cr.yaml'
  },
  {
    name: 'telemetry',
    deploymentYaml: 'telemetry-manager.yaml',
    crYaml: 'telemetry-default-cr.yaml'
  },
  {
    name: 'nats',
    deploymentYaml: 'nats-manager.yaml',
    crYaml: 'nats_default_cr.yaml'
  },
  {
    name: 'keda',
    deploymentYaml: 'keda-manager.yaml',
    crYaml: 'keda-default-cr.yaml'
  }
]


async function apply(res) {
  let path = await resPath(res)
  path += '?fieldManager=kubectl&fieldValidation=Strict&force=false'
  let response = await fetch(path, { method: 'PATCH', headers: { 'content-type': 'application/apply-patch+yaml' }, body: JSON.stringify(res) })
  console.log(response.status)
  return response
}

async function applyModule(m) {
  for (let r of m.resources) {
    await apply(r.resource)
  }
  await apply(m.cr.resource)
  checkStatus()
}

async function resPath(r) {
  let url = (r.apiVersion === 'v1') ? '/api/v1' : `/apis/${r.apiVersion}`
  let api = groupVersions[r.apiVersion]
  let resource = null
  if (api) {
    resource = api.resources.find((res) => res.kind == r.kind)
  }
  if (resource==null) {
    api = await cacheAPI(r.apiVersion)
    resource = api.resources.find((res) => res.kind == r.kind)  
  }
  if (resource) {
    let ns = r.metadata.namespace || 'default'
    let nsPath = resource.namespaced ? `/namespaces/${ns}` : ''
    return url + nsPath + `/${resource.name}/${r.metadata.name}`
  }
  return null

}
async function exists(path) {
  if (!path) {
    return false;
  }
  let response = await fetch(path)
  return (response.status == 200)
}

async function cacheAPI(apiVersion) {
  let url = (apiVersion === 'v1') ? '/api/v1' : `/apis/${apiVersion}`
  let res = await fetch(url)
  console.log("APIS response:", res.status)
  if (res.status == 200) {
    let body = await res.json()
    groupVersions[apiVersion] = body
    return body
  }
  return { resources: [] }
}
function deploymentList(m) {
  let html = '<ul>'
  for (let r of m.resources) {
    html += `<li>${r.path} ${r.status ? '(ok)' : '(not installed)'}</li>`
  }
  return html + '</ul>'
}
function moduleCard(m) {
  let buttons = document.createElement("div")
  let installBtn = document.createElement("button")
  installBtn.textContent = "Install " + m.name
  installBtn.addEventListener("click", function (event) {
    applyModule(m)
  })
  buttons.appendChild(installBtn)
  let card = document.createElement("div")
  let txt = document.createElement("div")
  let html = `<hr><h3>${m.name}</h3>
    <small>
    deployment: <b>${m.deploymentYaml}</b><br/>
    operator resources: ${deploymentList(m)}<br/>
    cr: <b>${m.crYaml}</b><br/>
    module configuration: ${m.cr.path} ${m.cr.status ? '(ok)' : '(not installed)'} <br/></small>`

  txt.innerHTML = html
  card.appendChild(txt)
  card.appendChild(buttons)
  return card
}


function renderModules() {
  let div = document.getElementById('modules');
  div.innerHTML = ""
  for (let m of modules) {
    div.appendChild(moduleCard(m))
  }
}

async function loadModules() {
  for (let m of modules) {
    let url = '/assets/modules/' + m.deploymentYaml
    let response = await fetch(url)
    let body = await response.text()
    m.resources = []
    jsyaml.loadAll(body, (doc) => {
      m.resources.push({ resource: doc })
    });

    url = '/assets/modules/' + m.crYaml
    response = await fetch(url)
    body = await response.text()
    m.cr = { resource: jsyaml.load(body) }
    let crPath = await resPath(m.cr.resource)
    m.cr.path = crPath

    for (let i of m.resources) {
      let path = await resPath(i.resource)
      i.path = path
    }
  }
  checkStatus()
}

function checkStatus() {
  for (let m of modules) { 
    resPath(m.cr.resource).then((p)=>{
      m.cr.path = p
      return exists(p)  
    }).then((ok)=>m.cr.status=ok)

    for (let r of m.resources) {
      if (r.path) {
        exists(r.path).then((ok)=>{r.status=ok
        renderModules()})
      }
    }
  }
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
      renderPods()
    })
}

function renderPods() {
  let html = ''
  pods.forEach(element => {
    html += element.metadata.namespace + ' ' + element.metadata.name + '<br/>'
  });
  document.getElementById('pods').innerHTML = html

}

loadModules()