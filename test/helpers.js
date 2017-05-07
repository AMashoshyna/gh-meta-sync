"use strict"
const got = require("got")
const port = process.env.PORT || 3000
const hook = `http://localhost:${port}/webhook`

const btoa = str => {
  return Buffer.from(str).toString("base64")
}

exports.json = obj => btoa(JSON.stringify(obj))
exports.emit = opts => got(hook, opts)
exports.expect = scope => {
  return new Promise(resolve => {
    scope.reply(200, resolve)
  })
}
