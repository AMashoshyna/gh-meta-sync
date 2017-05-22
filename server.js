"use strict"

const http = require("http")
const url = require("url")
const fetch = require("node-fetch")
const { atob } = require("./helpers")

const api = "https://api.github.com"
const repo = "octocat/hello-world"
const getDescr = {
  "package.json": pkg => {
    let { description } = JSON.parse(pkg)
    return { description }
  }
}

function* getMetadataFiles(addedFiles) {
  for (let file of addedFiles) {
    if (file in getDescr) yield file
  }
}

function* getFiles(body) {
  for (let commit of body.commits) {
    if (commit.added) yield* getMetadataFiles(commit.added)
  }
}

function getMetaData(path) {
  const url = `${api}/repos/${repo}/contents/${path}`
  return fetch(url)
    .then(r => r.json())
}

function setRepoDescription(obj) {
  const url = `${api}/repos/${repo}`
  const options = {
    method: "PATCH",
    body: JSON.stringify(obj),
  }
  return fetch(url, options)
}

function webhook(request, response) {
  request.on("data", data => {
    async function setData() {
      for (let file of getFiles(JSON.parse(atob(data)))) {
        if (!(file in getDescr)) continue
        let { content } = await getMetaData(file)
        let meta = getDescr[file](atob(content))
        setRepoDescription(meta)
      }
    }
    setData().then(_ => {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('ok');
    })
})}

function route(handle, pathname, request, response) {
  if (typeof handle[pathname] === "function") {
    handle[pathname](request, response)
  } else {
    console.log(`No request handler found for ${pathname}`)
    response.writeHead(404, { "Content-Type": "text/html" })
    response.write("404 Not found")
    response.end()
  }
}

function onRequest(request, response) {
  const pathname = url.parse(request.url).pathname
  const handle = {}
  handle["/webhook"] = webhook
  route(handle, pathname, request, response)
}


const server = http.createServer(onRequest)
exports.listen = port => {
  console.log(`Listening on: ${port}`)
  server.listen(port)
}

exports.close = () => {
  server.close()
}

server.listen(3000)
