"use strict"

const http = require("http")
const { URL } = require("url")
const fetch = require("node-fetch")
const { atob, getServerBase } = require("./helpers")
const router = require('./lib/router')

function onRequest(request, response) {
  const base = getServerBase(server)
  const  { pathname } = new URL(request.url, base)

  router(pathname, request, response)
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
