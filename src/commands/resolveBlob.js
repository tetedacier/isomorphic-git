import { GitRefManager } from '../managers/GitRefManager.js'
import { FileSystem } from '../models/FileSystem.js'
import { E, GitError } from '../models/GitError.js'
import { GitTree } from '../models/GitTree.js'
import { readObject } from '../storage/readObject.js'
import { join } from '../utils/join.js'
import { cores } from '../utils/plugins.js'
import { resolveTree } from '../utils/resolveTree.js'

/**
 * Resolve a git ref to a blob oid
 *
 * @link https://isomorphic-git.github.io/docs/resolveBlob.html
 */
export async function resolveBlob ({
  core = 'default',
  dir,
  gitdir = join(dir, '.git'),
  fs: _fs = cores.get(core).get('fs'),
  ref,
  filepath = undefined
}) {
  try {
    const fs = new FileSystem(_fs)
    let oid = await GitRefManager.resolve({ fs, gitdir, ref })
    if (filepath === undefined || filepath === '') {
      let { type } = await readObject({ fs, gitdir, oid })
      if (type === 'blob') {
        return oid
      } else {
        throw new GitError(E.ResolveBlobError, { oid })
      }
    }
    // Ensure there are no leading or trailing directory separators.
    // I was going to do this automatically, but then found that the Git Terminal for Windows
    // auto-expands --filepath=/src/utils to --filepath=C:/Users/Will/AppData/Local/Programs/Git/src/utils
    // so I figured it would be wise to promote the behavior in the application layer not just the library layer.
    if (filepath.startsWith('/') || filepath.endsWith('/')) {
      throw new GitError(E.DirectorySeparatorsError)
    }
    const _oid = oid
    let result = await resolveTree({ fs, gitdir, oid })
    let tree = result.tree
    let pathArray = filepath.split('/')
    return resolveFile({
      fs,
      gitdir,
      tree,
      pathArray,
      oid: _oid,
      filepath
    })
  } catch (err) {
    err.caller = 'git.resolveBlob'
    throw err
  }
}

async function resolveFile ({ fs, gitdir, tree, pathArray, oid, filepath }) {
  let name = pathArray.shift()
  for (let entry of tree) {
    if (entry.path === name) {
      if (pathArray.length === 0) {
        return entry.oid
      } else {
        let { type, object } = await readObject({
          fs,
          gitdir,
          oid: entry.oid
        })
        if (type === 'blob') {
          throw new GitError(E.DirectoryIsAFileError, { oid, filepath })
        }
        if (type !== 'tree') {
          throw new GitError(E.ObjectTypeAssertionInTreeFail, {
            oid: entry.oid,
            entrypath: filepath,
            type
          })
        }
        tree = GitTree.from(object)
        return resolveFile({ fs, gitdir, tree, pathArray, oid, filepath })
      }
    }
  }
  throw new GitError(E.TreeOrBlobNotFoundError, { oid, filepath })
}
