const { checkMergability, getPullRequest } = require('./utilities')
const { cascadingBranchMerge } = require('./cascading-branch-merge')

const core = require('@actions/core');
const github = require('@actions/github');

/**
 * @description Entrypoint
 */
 async function exec() {

    try {
        const prefixes = core.getInput("prefixes")
        const refBranch = core.getInput("refBranch")
        const token = core.getInput("GITHUB_TOKEN")
        const octokit = github.getOctokit(token)
        const context = github.context
        const owner = github.context.repo.owner
        const repo = github.context.repo.repo
        const pullNumber = context.payload.pull_request.number
        const headBranch = context.payload.pull_request.head.ref
        const baseBranch = context.payload.pull_request.base.ref
        console.log('phase 1')

        let prefixArray = prefixes.split(",")
        
        console.log('GITHUB_TOKEN: ' + token)
        console.log('owner: ' + owner)
        console.log('repo: ' + repo)
        console.log('prefixes: ' + prefixes)
        console.log('prefixArray: ' + prefixArray)
        console.log('refBranch: ' + refBranch)
        console.log('pullNumber: ' + pullNumber)
        console.log('headBranch: ' + headBranch)
        console.log('baseBranch: ' + baseBranch)

        console.log(context)

        const repository = {
            "owner": owner,
            "repo": repo
        }

        cascadingBranchMerge(
            prefixArray,        // array of prefixes
            refBranch,
            headBranch,
            baseBranch,
            repository,
            octokit,
            pullNumber
        )
        
    } catch (e) {
        console.log(e)
    }
}

// Entrypoint
exec()
