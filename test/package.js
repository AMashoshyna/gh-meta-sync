"use strict"
const nock = require("nock")
const {json, emit, expect} = require("./helpers")
const {api, repo, description} = require("./constants")
const {listen, close} = require("./../server")

const path = "package.json"
const contents = `${repo}/contents/${path}`
const response =  {
        commits: [{
          added: [path, "README.MD"],
          modified: [],
        },
        {
added:["README.MD"],
modified: []
        },
                {
added:["README.MD", "package.json"],
modified: []
        }],
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
      body: JSON.stringify(response)
    })

    let patchDesc = nock(api)
      .log(console.log)
      .patch(repo, body => {
        return body.description == description
      })

    return expect(patchDesc)
  })
})
