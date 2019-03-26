import { FileSystem } from '../models/FileSystem.js'
import { E, GitError } from '../models/GitError.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'

/**
 * Read a git blob object directly by its object id
 *
 * @link https://isomorphic-git.github.io/docs/readBlob.html
 */
export async function readBlob ({
  core = 'default',
  dir,
  gitdir = join(dir, '.git'),
  fs: _fs = cores.get(core).get('fs'),
  oid,
}) {
  try {
    const fs = new FileSystem(_fs)
    let result = await readObject({
      fs,
      gitdir,
      oid,
      format: 'content'
    })
    if (result.type !== 'blob') {
      throw new GitError(E.ObjectTypeAssertionError, { oid, expected: 'blob', type: result.type })
    }
    return result.object
  } catch (err) {
    err.caller = 'git.readBlob'
    throw err
  }
}
