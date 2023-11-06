var pods = []
var groupVersions = {}

var modules = [
  {
    name: 'istio',
    deploymentYaml: 'istio-manager.yaml',
    crYaml: 'istio-default-cr.yaml'
  },
  {
    name: 'serverless',
    deploymentYaml: 'serverless-operator.yaml',
    crYaml: 'default-serverless-cr.yaml'
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
  for (let r of m.namespaces) {
    await apply(r.resource)
  }
  for (let r of m.resources) {
    await apply(r.resource)
  }
  await apply(m.cr.resource)
  loadModules()
}

async function resPath(r) {
  let url = (r.apiVersion === 'v1') ? '/api/v1' : `/apis/${r.apiVersion}`
  let response = await apis(r.apiVersion)
  let resource = response.resources.find((res) => res.kind == r.kind)
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

async function apis(apiVersion) {
  if (groupVersions[apiVersion]) {
    return groupVersions[apiVersion]
  } else {
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
}
function deploymentList(m) {
  let html = '<ul>'
  for (let r of m.namespaces) {
    html += `<li>${r.path} - ${r.status ? '(ok)' : '(not installed)'}</li>`
  }
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
    console.log(event)
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
    m.cr.status = await exists(crPath)

    let ns = {}
    for (let i of m.resources) {
      let path = await resPath(i.resource)
      i.path = path
      i.status = await exists(path)
      if (i.resource.metadata.namespace && i.resource.metadata.namespace != 'default') {
        let name = i.resource.metadata.namespace
        let nsPath = `/api/v1/namespaces/${name}`

        if (ns[name] == undefined) {
          let nsOk = await exists(nsPath)
          ns[name] = nsOk
        }
      }
    }
    m.namespaces = []
    for (let n of Object.keys(ns)) {
      if (!m.resources.some((i) => i.path == `/api/v1/namespaces/${n}`)) {
        m.namespaces.push({ resource: { apiVersion: 'v1', kind: 'Namespace', metadata: { name: n } }, path: `/api/v1/namespaces/${n}`, status: ns[n] })
      }
    }
  }
  renderModules()
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