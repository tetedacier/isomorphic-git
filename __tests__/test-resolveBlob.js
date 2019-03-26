/* eslint-env node, browser, jasmine */
const { makeFixture } = require('./__helpers__/FixtureFS.js')
const snapshots = require('./__snapshots__/test-resolveBlob.js.snap')
const registerSnapshots = require('./__helpers__/jasmine-snapshots')

const { resolveBlob } = require('isomorphic-git')

describe('resolveBlob', () => {
  beforeAll(() => {
    registerSnapshots(snapshots)
  })
  it('test missing', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
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
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let oid = await resolveBlob({
      gitdir,
      oid: 'e10ebb90d03eaacca84de1af0a59b444232da99e'
    })
    expect(oid).toBe('')
  })
  it('from packfile', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let oid = await resolveBlob({
      gitdir,
      oid: '0b8faa11b353db846b40eb064dfb299816542a46'
    })
    expect(oid).toBe('')
  })
  it('with simple filepath to blob', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let oid = await resolveBlob({
      gitdir,
      oid: 'be1e63da44b26de8877a184359abace1cddcb739',
      filepath: 'cli.js'
    })
    expect(oid).toBe('')
  })
  it('with deep filepath to blob', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let oid = await resolveBlob({
      gitdir,
      oid: 'be1e63da44b26de8877a184359abace1cddcb739',
      filepath: 'src/commands/clone.js'
    })
    expect(oid).toBe('')
  })
  it('with simple filepath to tree', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
        gitdir,
        oid: 'be1e63da44b26de8877a184359abace1cddcb739',
        filepath: ''
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('with deep filepath to tree', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
        gitdir,
        oid: 'be1e63da44b26de8877a184359abace1cddcb739',
        filepath: 'src/commands'
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('with erroneous filepath (directory is a file)', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
        gitdir,
        oid: 'be1e63da44b26de8877a184359abace1cddcb739',
        filepath: 'src/commands/clone.js/isntafolder.txt'
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('with erroneous filepath (no such directory)', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
        gitdir,
        oid: 'be1e63da44b26de8877a184359abace1cddcb739',
        filepath: 'src/isntafolder'
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('with erroneous filepath (leading slash)', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
        gitdir,
        oid: 'be1e63da44b26de8877a184359abace1cddcb739',
        filepath: '/src'
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('with erroneous filepath (trailing slash)', async () => {
    // Setup
    let { gitdir } = await makeFixture('test-resolveBlob')
    // Test
    let error = null
    try {
      await resolveBlob({
        gitdir,
        oid: 'be1e63da44b26de8877a184359abace1cddcb739',
        filepath: 'src/'
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
})
