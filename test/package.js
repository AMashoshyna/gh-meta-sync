"use strict"
const nock = require("nock")
const {json, emit, expect} = require("./helpers")
const {api, repo, description} = require("./constants")

const path = "package.json"
const contents = `${repo}/contents/${path}`

describe(path, () => {
  afterEach(() => {
    nock.cleanAll()
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
      body: {
        commits: [{
          added: [path],
          modified: [],
        }],
      },
    })

    let patchDesc = nock(api)
      .patch(repo, body => {
        return body.description == description
      })

    return expect(patchDesc)
  })
})
