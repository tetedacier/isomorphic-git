/* eslint-env node, browser, jasmine */
const { makeFixture } = require('./__helpers__/FixtureFS.js')
const snapshots = require('./__snapshots__/test-readBlob.js.snap')
const registerSnapshots = require('./__helpers__/jasmine-snapshots')

const { readBlob } = require('isomorphic-git')

describe('readBlob', () => {
  beforeAll(() => {
    registerSnapshots(snapshots)
  })
  it('test missing', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-readBlob')
    // Test
    let error = null
    try {
      await readBlob({
        gitdir,
        oid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('parsed', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-readBlob')
    // Test
    let blob = await readBlob({
      gitdir,
      oid: 'e10ebb90d03eaacca84de1af0a59b444232da99e'
    })
    expect(blob.toString('hex')).toMatchSnapshot()
  })
  it('from packfile', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-readBlob')
    // Test
    let blob = await readBlob({
      gitdir,
      oid: '0b8faa11b353db846b40eb064dfb299816542a46'
    })
    expect(blob.toString('hex')).toMatchSnapshot()
  })
})
