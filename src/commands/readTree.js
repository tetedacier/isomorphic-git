import { FileSystem } from '../models/FileSystem.js'
import { E, GitError } from '../models/GitError.js'
import { GitTree } from '../models/GitTree.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'

/**
 * Read a git tree object directly by its object id
 *
 * @link https://isomorphic-git.github.io/docs/readTree.html
 */
export async function readTree ({
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
    if (result.type !== 'tree') {
      throw new GitError(E.ObjectTypeAssertionError, { oid, expected: 'tree', type: result.type })
    }
    return { entries: GitTree.from(result.object).entries() }
  } catch (err) {
    err.caller = 'git.readTree'
    throw err
  }
}
