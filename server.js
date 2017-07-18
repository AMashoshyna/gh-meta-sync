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

const isConfig = fileName => {console.log("filename", fileName, typeof getDescr[fileName] === "function"); return typeof getDescr[fileName] === "function"}
const commitFilter = commit => ["added", "removed", "modified"]
.filter(status => commit[status])
.reduce((cur, next) => commit[cur].some(isConfig) || commit[next].some(isConfig))

function webhook(request, response) {
  request.on("data", data => {
function* getFiles(body) {
  for (let commit of body.commits) {
    if (commit.added !== undefined) yield commit
  }
}
async function setData() {
  console.log(JSON.parse(atob(data)))
for (let file of getFiles(JSON.parse(atob(data)))) {
  console.log(file)
	if (!(file in getDescr)) continue

	let content = await getMetaData(file)
	let meta = getDescr[file](atob(result.content))
	setRepoDescription(meta)
}
  return setData()
 response.writeHead(200)
  response.end()
}
// const commitsWithMetaData =JSON.parse(atob(data)).commits.filter(commitFilter)

//     if(commitsWithMetaData.length) {
//       return commitsWithMetaData.map(async commit => {
//        const path = commit.added[0]
//        const result = await getMetaData(path)
//        const payload = (getDescr[path](atob(result.content)))
//        return setRepoDescription(payload)
//       })
//     }
//   })
  // response.writeHead(200)
  // response.end()

})}

function filterCommits(commits) {
return commits.filter(obj => obj.added["package.json"])
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

function onRequest(request, response) {
  const pathname = url.parse(request.url).pathname
  const handle = {}
  handle["/webhook"] = webhook
  route(handle, pathname, request, response)
}

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

const server = http.createServer(onRequest)
exports.listen = port => {
  console.log(`Listening on: ${port}`)
  server.listen(port)
}

exports.close = () => {
  server.close()
}

server.listen(3000)
