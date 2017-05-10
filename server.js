"use strict"

const http = require("http")
const url = require("url")
const fetch = require("node-fetch")
const { atob } = require("./helpers")

const api = "https://api.github.com"
const repo = "/repos/octocat/hello-world"
const metaDataPath = "package.json"


function webhook(request, response) {
  return getMetaData()
    .then(result => {
      let payload = atob(result.content)
      return setRepoDescription(payload)
    })
}

function getMetaData() {
  const url = `${api}${repo}/contents/${metaDataPath}`
  const options = {
    method: "GET",
  }
  return fetch(url, options).then(response => response.json())
}

function setRepoDescription(str) {
  const url = `${api}${repo}`
  const options = {
    method: "PATCH",
    body: JSON.stringify(JSON.parse(str)),
  }
  return fetch(url, options)
}

function onRequest(request, response) {
  const pathname = url.parse(request.url).pathname
  const handle = {}
  handle["/webhook"] = webhook
  route(handle, pathname, response, request)
}

function route(handle, pathname, response, request) {
  if (typeof handle[pathname] === "function") {
    handle[pathname](response, request)
  } else {
    console.log(`No request handler found for ${pathname}`)
    response.writeHead(404, { "Content-Type": "text/html" })
    response.write("404 Not found")
    response.end()
  }
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
