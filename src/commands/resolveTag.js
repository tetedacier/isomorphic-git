import { GitRefManager } from '../managers/GitRefManager.js'
import { FileSystem } from '../models/FileSystem.js'
import { E, GitError } from '../models/GitError.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'

/**
 * Resolve a git ref to a tag oid
 *
 * @link https://isomorphic-git.github.io/docs/resolveTag.html
 */
export async function resolveTag ({
  core = 'default',
  dir,
  gitdir = join(dir, '.git'),
  fs: _fs = cores.get(core).get('fs'),
  ref
}) {
  try {
    const fs = new FileSystem(_fs)
    let oid = await GitRefManager.resolve({ fs, gitdir, ref })
    let { type } = await readObject({ fs, gitdir, oid })
    if (type === 'tag') {
      return oid
    }
    throw new GitError(E.ResolveCommitError, { oid })
  } catch (err) {
    err.caller = 'git.resolveTag'
    throw err
  }
}
