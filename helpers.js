"use strict"

exports.btoa = str => {
  return Buffer.from(str).toString("base64")
}

exports.atob = str => {
  return Buffer.from(str, "base64").toString("utf-8")
}

exports.getServerBase = server => {
  const { family, address, port } = server.address()
  const hostname = family == "IPv4" ? address : `[${address}]`
  return `http://${hostname}:${port}`
}
