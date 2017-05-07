const http = require("http")
const url = require("url")
const fetch = require("node-fetch")

const api = "https://api.github.com"
const repo = "/repos/octocat/hello-world"

function webhook(request, response) {
  console.log("Request handler 'webhook' was called.")
  return getCommitChanges()
    .then(result => {
      let payload = { description: result.content }
      return setRepoDescription(payload)
    })
}

function getCommitChanges() {
  const url = `${api}${repo}/contents/package.json`
  const options = {
    method: "GET"
  }
  return fetch(url, options)
}

function setRepoDescription(description) {
  const url = `${api}${repo}`
  const options = {
    method: "PATCH",
    body: description,
  }
  return fetch(url, options)
}

function onRequest(request, response) {
  const pathname = url.parse(request.url).pathname
  console.log(`Request for ${pathname} received.`)
  const handle = {}
  handle["/webhook"] = webhook
  route(handle, pathname, response, request)
}

function route(handle, pathname, response, request) {
  console.log(`About to route a request for ${pathname}`)
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
