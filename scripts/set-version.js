const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoUrl = process.env.REPO_URL || 'https://github.com/tn-aixpa/overtourism-frontend';

function getGitValue(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (e) {
    return '';
  }
}

const tag =
  process.env.CI_COMMIT_TAG ||
  process.env.GITHUB_REF_NAME ||
  getGitValue('git describe --tags --exact-match') ||
  getGitValue('git describe --tags --always') ||
  '';

const commit =
  process.env.CI_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  getGitValue('git rev-parse --short HEAD') ||
  '';

const displayVersion = tag || (commit ? `sha-${commit.substring(0, 7)}` : 'dev');

let releaseUrl = repoUrl;
if (tag) {
  releaseUrl = `${repoUrl}/releases/tag/${tag}`;
} else if (commit) {
  releaseUrl = `${repoUrl}/commit/${commit}`;
}

const configPaths = [
  path.join(__dirname, '../src/assets/config.json'),
  path.join(__dirname, '../public/config.json')
];

configPaths.forEach(cfgPath => {
  if (fs.existsSync(cfgPath)) {
    const raw = fs.readFileSync(cfgPath, 'utf8');
    const json = JSON.parse(raw);
    json.version = {
      version: displayVersion,
      tag: tag,
      commit: commit,
      repoUrl: repoUrl,
      releaseUrl: releaseUrl
    };
    fs.writeFileSync(cfgPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`[set-version] Aggiornato ${cfgPath} -> ${displayVersion} (${releaseUrl})`);
  }
});