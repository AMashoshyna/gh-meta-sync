"use strict"

const http = require("http")
const url = require("url")
const fetch = require("node-fetch")
const { atob } = require("./helpers")

const api = "https://api.github.com"
const repo = "octocat/hello-world"
const metaDataPath = "package.json"


async function webhook(request, response) {
  const result = await r()
  const payload = atob(result.content)
  return setRepoDescription(payload)
}

function r() {
  const url = `${api}/repos/${repo}/contents/${metaDataPath}`
  return fetch(url).then(response => response.json())
}

function setRepoDescription(str) {
  const url = `${api}/repos/${repo}`
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
