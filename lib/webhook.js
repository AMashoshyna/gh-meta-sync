"use strict"

const { atob } = require("../helpers")
const fetch = require("node-fetch")

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

function setRepoMeta(obj) {
  const url = `${api}/repos/${repo}`
  const options = {
    method: "PATCH",
    body: JSON.stringify(obj),
  }
  return fetch(url, options)
}

function webhook(request, response) {
  request.on("data", async data => {
      for (let file of getFiles(JSON.parse(atob(data)))) {
        if (!(file in getDescr)) continue
        let { content } = await getMetaData(file)
        let meta = getDescr[file](atob(content))
        setRepoMeta(meta)
      }
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('ok');
})}

module.exports = webhook
