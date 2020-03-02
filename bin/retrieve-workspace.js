require('dotenv').config({ silent: true })
const https = require('https')
const path = require('path')
const fs = require('fs')

const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY

if (!process.env.DEFAULT_WORKSPACE || !API_GATEWAY_URL) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'WARNING!: Configuration not found in env variables, will use defaults'
  )
}
const WORKSPACE_API_URL = API_GATEWAY_URL
  ? API_GATEWAY_URL + '/v2'
  : 'https://gateway.api.dev.globalfishingwatch.org/v2'
const DEFAULT_WORKSPACE = process.env.DEFAULT_WORKSPACE || 'vizz-default-workspace-v16'
const WORKSPACE_PATH = 'src/app/workspace/workspace.js'

console.log('Retrieving worskpace with configuration:')
console.log('WORKSPACE_API_URL', WORKSPACE_API_URL)
console.log('DEFAULT_WORKSPACE', DEFAULT_WORKSPACE)
console.log('REQUESTED URL', `${WORKSPACE_API_URL}/workspaces/${DEFAULT_WORKSPACE}`)

https
  .get(`${WORKSPACE_API_URL}/workspaces/${DEFAULT_WORKSPACE}`, (resp) => {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    })
    resp.on('end', () => {
      try {
        const workspaceJSON = JSON.parse(data)
        let workspace = JSON.stringify(workspaceJSON, null, 2)
        workspace = `
// AUTOMATICALLY RETRIEVED FROM ENV VARIABLES. WILL BE OVERWRITTEN AT NEXT NPM INSTALL.
const defaultWorkspace = ${workspace};
export default defaultWorkspace;
      `
        const finalPath = path.join(process.cwd(), WORKSPACE_PATH)
        console.log('Writing workspace to', finalPath)
        fs.writeFileSync(finalPath, workspace)
      } catch (err) {
        console.log('Could not parse/write workspace: ' + err.message)
      }
    })
  })
  .on('error', (err) => {
    console.log('Could not load workspace: ' + err.message)
    process.exit(1)
  })
