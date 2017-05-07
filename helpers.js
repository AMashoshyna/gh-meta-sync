"use strict"

exports.btoa = str => {
  return Buffer.from(str).toString("base64")
}

exports.atob = str => {
  return Buffer.from(str, "base64").toString("utf-8")
}
