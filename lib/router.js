"use strict"

const webhook = require('./webhook')

const handle = {}
handle["/webhook"] = webhook

function route(pathname, request, response) {
  if (typeof handle[pathname] === "function") {
    handle[pathname](request, response)
  } else {
    console.log(`No request handler found for ${pathname}`)
    response.writeHead(404, { "Content-Type": "text/html" })
    response.write("404 Not found")
    response.end()
  }
}

module.exports = route
