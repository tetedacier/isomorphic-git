import { FileSystem } from '../models/FileSystem.js'
import { GitAnnotatedTag } from '../models/GitAnnotatedTag.js'
import { E, GitError } from '../models/GitError.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'

/**
 * Read a git tag object directly by its object id
 *
 * @link https://isomorphic-git.github.io/docs/readTag.html
 */
export async function readTag ({
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
    if (result.type !== 'tag') {
      throw new GitError(E.ObjectTypeAssertionError, { oid, expected: 'tag', type: result.type })
    }
    return GitAnnotatedTag.from(result.object).parse()
  } catch (err) {
    err.caller = 'git.readTag'
    throw err
  }
}
