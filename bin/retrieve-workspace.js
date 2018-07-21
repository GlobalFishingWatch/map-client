require('dotenv').config({ silent: true });
const https = require('https');
const path = require('path');
const fs = require('fs');

const envVariables = process.env;
const WORKSPACE_PATH = 'app/src/workspace/workspace.js';

console.log('Retrieving worskpace with configuration:');
console.log('V2_API_ENDPOINT', envVariables.V2_API_ENDPOINT);
console.log('DEFAULT_WORKSPACE', envVariables.DEFAULT_WORKSPACE);

if (!envVariables.DEFAULT_WORKSPACE || !envVariables.V2_API_ENDPOINT) {
  console.log('Error reading workspace');
  process.exit(1);
}

https.get(`${envVariables.V2_API_ENDPOINT}/workspaces/${envVariables.DEFAULT_WORKSPACE}`, (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    try {
      const workspaceJSON = JSON.parse(data);
      let workspace = JSON.stringify(workspaceJSON, null, 2);
      workspace = `
// AUTOMATICALLY RETRIEVED FROM ENV VARIABLES. DO NOT EDIT.
const defaultWorkspace = ${workspace};
export default defaultWorkspace;
      `;
      const finalPath = path.join(process.cwd(), WORKSPACE_PATH);
      console.log('Writing workspace to', finalPath);
      fs.writeFileSync(finalPath, workspace);

    } catch (err) {
      console.log('Could not parse/write workspace: ' + err.message);
    }
  });
}).on('error', (err) => {
  console.log('Could not load workspace: ' + err.message);
  process.exit(1);
});
