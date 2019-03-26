import { GitRefManager } from '../managers/GitRefManager.js'
import { FileSystem } from '../models/FileSystem.js'
import { GitAnnotatedTag } from '../models/GitAnnotatedTag.js'
import { E, GitError } from '../models/GitError.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'

/**
 * Resolve a git ref to a commit oid
 *
 * @link https://isomorphic-git.github.io/docs/resolveCommit.html
 */
export async function resolveCommit ({
  core = 'default',
  dir,
  gitdir = join(dir, '.git'),
  fs: _fs = cores.get(core).get('fs'),
  ref
}) {
  try {
    const fs = new FileSystem(_fs)
    let oid = await GitRefManager.resolve({ fs, gitdir, ref })
    let { type, object } = await readObject({ fs, gitdir, oid })
    if (type === 'commit') {
      return oid
    }
    // Resolve annotated tag objects to whatever
    if (type === 'tag') {
      oid = GitAnnotatedTag.from(object).parse().object
      return resolveCommit({ fs, gitdir, oid })
    }
    throw new GitError(E.ResolveCommitError, { oid })
  } catch (err) {
    err.caller = 'git.resolveCommit'
    throw err
  }
}
