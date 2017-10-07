"use strict"

const nock = require("nock")
const { json, emit, expect } = require("./helpers")
const { api, repo, description } = require("./constants")
const { listen, close } = require("../server")

const path = "package.json"
const contents = `${repo}/contents/${path}`
const responseFilesAdded =  {
        commits: [
          {
            added: [path, "README.MD"],
            modified: [],
          },
          {
            added: ["README.MD"],
            modified: []
          },
        ],
      }
const responseFilesModified =  {
        commits: [
          {
            added: ["README.MD"],
            modified: []
          },
          {
            added:[],
            modified: ["README.MD", path]
          },
        ],
      }

describe(path, () => {
  beforeEach(() => {
    listen(3000)
  })
  afterEach(() => {
    nock.cleanAll()
    close()
  })

  it("added, description", () => {
    let getContent = nock(api)
      .get(contents)
      .reply(200, {
        content: json({
          description,
        }),
      })

    emit({
      body: JSON.stringify(responseFilesAdded)
    })

    let patchDesc = nock(api)
      .patch(repo, body => {
        return body.description == description
      })

    return expect(patchDesc)
  })

  it("modified, description", () => {
    let getContent = nock(api)
      .get(contents)
      .reply(200, {
        content: json({
          description,
        }),
      })

    emit({
      body: JSON.stringify(responseFilesModified)
    })

    let patchDesc = nock(api)
      .patch(repo, body => {
        return body.description == description
      })

    return expect(patchDesc)
  })
})
