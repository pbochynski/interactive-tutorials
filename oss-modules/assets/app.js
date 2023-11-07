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
  },
  {
    name: 'cap-operator',
    deploymentYaml: 'cap-manager.yaml',
    crYaml: 'cap-default-cr.yaml',
    community: true
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
}

async function resPath(r) {
  let url = (r.apiVersion === 'v1') ? '/api/v1' : `/apis/${r.apiVersion}`
  let api = groupVersions[r.apiVersion]
  let resource = null
  if (api) {
    resource = api.resources.find((res) => res.kind == r.kind)
  }
  if (resource == null) {
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
  let div = document.createElement("div")
  if (m.details) {
    let html = '<ul class="list-group">'
    for (let r of m.resources) {
      let badge = `<span class="badge bg-secondary"> - </span>`
      if (r.status === true) {
        badge = `<span class="badge bg-success">installed</span>`
      } else if (r.status === false) {
        badge = `<span class="badge bg-success">not applied</span>`        
      }
      html += `<li class="list-group-item">${r.path} ${badge}</li>`
    }
    div.innerHTML = html + '</ul>'
  }
  return div
}
function resourcesBadge(m) {
  let c = 0
  for (let r of m.resources) {
    if (r.status) {
      c++
    }
  }
  if (c == m.resources.length) {
    return `<span class="badge bg-success">installed (${m.resources.length})</span>`
  }
  return `<span class="badge bg-secondary">(${c}/${m.resources.length})</span>`
}
function crBadge(m) {
  if (m.cr.status) {
    if (m.cr.value && m.cr.value.status && m.cr.value.status.state == "Ready") {
      return `<span class="badge bg-success">Ready</span>`
    }
    if (m.cr.value && m.cr.value.status && m.cr.value.status.state) {
      return `<span class="badge bg-warning text-dark">${m.cr.value.status.state}</span>`
    }
    return `<span class="badge bg-warning text-dark">applied</span>`
  }
  return `<span class="badge bg-secondary"> - </span>`
}
function moduleCard(m) {
  let buttons = document.createElement("div")
  let installBtn = document.createElement("button")
  installBtn.textContent = "Install " + m.name
  installBtn.setAttribute('class', 'btn btn-outline-primary')
  installBtn.addEventListener("click", function (event) {
    applyModule(m)
    checkStatus()
  })
  let detailsBtn = document.createElement("button")
  detailsBtn.textContent = (m.details) ? "hide details" : "show details"
  detailsBtn.setAttribute('class', 'btn btn-outline-primary')
  detailsBtn.addEventListener("click", function (event) {
    m.details = !m.details
    renderModules()
  })
  buttons.appendChild(installBtn)
  buttons.appendChild(detailsBtn)
  let card = document.createElement("div")
  card.setAttribute('class', 'card')
  let cardBody = document.createElement('div')
  cardBody.setAttribute('class', 'card-body')
  let txt = document.createElement("div")
  let html = `<h5>${m.name}</h5>
    <small>
    deployment: <b>${m.deploymentYaml}</b> ${resourcesBadge(m)}<br/>
    cr: <b>${m.crYaml}</b> ${crBadge(m)}<br/></small>`
  txt.innerHTML = html
  cardBody.appendChild(txt)
  cardBody.appendChild(buttons)
  cardBody.appendChild(deploymentList(m))
  card.appendChild(cardBody)
  card.setAttribute('id', 'module-' + m.name)
  return card
}


function renderModules(m) {
  if (m) {
    let mDiv = document.getElementById('module-' + m.name)
    if (mDiv) {
      mDiv.parentNode.replaceChild(moduleCard(m), mDiv)
    }
  } else {
    let div = document.getElementById('modules');
    div.innerHTML = ""
    for (let m of modules) {
      div.appendChild(moduleCard(m))
    }

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
  renderModules()
  checkStatus()
}

function checkStatus() {
  for (let m of modules) {
    resPath(m.cr.resource).then((p) => {
      m.cr.path = p
      return fetch(p)
    }).then((res) => {
      m.cr.status = (res.status == 200)
      return m.cr.status ? res.json() : null
    }
    ).then((body) => {
      m.cr.value = body
      renderModules(m)
    })

    for (let r of m.resources) {
      if (r.path) {
        fetch(r.path).then((res) => {
          if (res.status == 200) {
            r.status = true
            return res.json()
          }
          return null
        }).then((json) => {
          r.value = json
          renderModules(m)
        })
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