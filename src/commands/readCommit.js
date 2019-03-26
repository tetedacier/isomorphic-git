import { FileSystem } from '../models/FileSystem.js'
import { GitCommit } from '../models/GitCommit.js'
import { E, GitError } from '../models/GitError.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'

/**
 * Read a git commit object directly by its object id
 *
 * @link https://isomorphic-git.github.io/docs/readCommit.html
 */
export async function readCommit ({
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
    if (result.type !== 'commit') {
      throw new GitError(E.ObjectTypeAssertionError, { oid, expected: 'commit', type: result.type })
    }
    return GitCommit.from(result.object).parse()
  } catch (err) {
    err.caller = 'git.readCommit'
    throw err
  }
}
