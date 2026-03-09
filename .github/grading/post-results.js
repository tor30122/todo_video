const fs = require('fs');

// This script is meant to be run via actions/github-script,
// so `github`, `context`, and `core` are available globally.
// However, we export a function that the workflow calls.

function escapeHtml(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = async function({ github, context, core }) {
  let results;
  try {
    results = JSON.parse(fs.readFileSync('.github/grading/results.json', 'utf8'));
  } catch (err) {
    core.warning(`Could not read results.json: ${err.message}`);
    results = { passed: false, step: 0, checks: [{ name: 'Validering', passed: false, status: 'Feil', hint: 'Valideringsskriptet krasjet. Sjekk at filene dine har gyldig syntaks og prøv igjen.' }] };
  }
  const issues = JSON.parse(fs.readFileSync('.github/grading/issues.json', 'utf8'));

  const owner = context.repo.owner;
  const repo = context.repo.repo;

  // Find current open assignment issue
  const openIssues = await github.rest.issues.listForRepo({
    owner, repo,
    state: 'open',
    labels: 'oppgave',
    sort: 'created',
    direction: 'asc'
  });

  if (openIssues.data.length === 0) {
    core.info('No open assignment issues found.');
    return;
  }

  const currentIssue = openIssues.data[0];
  // Derive step from issue title as fallback (e.g. if check.js crashed)
  const stepMatch = currentIssue.title.match(/Steg\s+(\d+)/i);
  const currentStep = results.step || (stepMatch ? parseInt(stepMatch[1]) : 1);

  // Upload screenshot
  var screenshotUrl = '';
  const screenshotPath = '.github/grading/screenshot.png';
  if (fs.existsSync(screenshotPath) && fs.statSync(screenshotPath).size > 0) {
    try {
      // Upload as issue comment image
      const imageBuffer = fs.readFileSync(screenshotPath);
      const base64 = imageBuffer.toString('base64');
      // GitHub doesn't have a direct image upload API for issues,
      // so we'll use a markdown trick with a repository file
      // For simplicity, we include it as a base64 data URL in the comment
      // Note: GitHub markdown doesn't support data URIs in issues.
      // Instead, we'll commit the screenshot to a branch.

      const branchName = 'screenshots';
      const fileName = `screenshots/step-${currentStep}-${Date.now()}.png`;

      // Ensure screenshots branch exists
      try {
        await github.rest.git.getRef({ owner, repo, ref: `heads/${branchName}` });
      } catch (e) {
        // Create branch from main
        const mainRef = await github.rest.git.getRef({ owner, repo, ref: 'heads/main' });
        await github.rest.git.createRef({
          owner, repo,
          ref: `refs/heads/${branchName}`,
          sha: mainRef.data.object.sha
        });
      }

      // Get current commit on screenshots branch
      const branch = await github.rest.git.getRef({ owner, repo, ref: `heads/${branchName}` });
      const commit = await github.rest.git.getCommit({ owner, repo, commit_sha: branch.data.object.sha });

      // Create blob
      const blob = await github.rest.git.createBlob({
        owner, repo,
        content: base64,
        encoding: 'base64'
      });

      // Create tree
      const tree = await github.rest.git.createTree({
        owner, repo,
        base_tree: commit.data.tree.sha,
        tree: [{
          path: fileName,
          mode: '100644',
          type: 'blob',
          sha: blob.data.sha
        }]
      });

      // Create commit
      const newCommit = await github.rest.git.createCommit({
        owner, repo,
        message: `Skjermbilde for steg ${currentStep}`,
        tree: tree.data.sha,
        parents: [branch.data.object.sha]
      });

      // Update branch ref
      await github.rest.git.updateRef({
        owner, repo,
        ref: `heads/${branchName}`,
        sha: newCommit.data.sha
      });

      screenshotUrl = `https://github.com/${owner}/${repo}/raw/${branchName}/${fileName}`;
    } catch (err) {
      core.warning(`Could not upload screenshot: ${err.message}`);
    }
  }

  // Build the comment
  var comment = '';

  if (results.passed) {
    comment += `## Steg ${currentStep} er godkjent!\n\n`;
    comment += `Bra jobba! Alle sjekkene er bestått. `;
    if (currentStep < 8) {
      comment += `Neste oppgave er klar for deg — sjekk Issues-fanen!\n\n`;
    } else {
      comment += `**Du har fullført hele prosjektet! Gratulerer!**\n\n`;
    }
  } else {
    comment += `## Steg ${currentStep} — nesten der!\n\n`;
    comment += `Noen av sjekkene ble ikke bestått. Det er helt normalt — les tilbakemeldingen under og prøv igjen!\n\n`;
  }

  // Build results table
  comment += `### Sjekkliste\n\n`;
  comment += `<table>\n`;
  comment += `<tr><th>Sjekk</th><th>Status</th><th>Hva du kan gjøre</th></tr>\n`;
  for (const c of results.checks) {
    const bg = c.passed ? '#d4edda' : '#f8d7da';
    const statusText = escapeHtml(c.status || (c.passed ? 'Bestått' : 'Ikke bestått'));
    const hint = c.hint || '';
    comment += `<tr><td>${escapeHtml(c.name)}</td><td bgcolor="${bg}"><strong>${statusText}</strong></td><td>${hint}</td></tr>\n`;
  }
  comment += `</table>\n`;

  // Add screenshot
  if (screenshotUrl) {
    comment += `\n### Slik ser siden din ut nå\n\n`;
    comment += `![Skjermbilde av siden](${screenshotUrl})\n`;
  }

  // Post the comment
  await github.rest.issues.createComment({
    owner, repo,
    issue_number: currentIssue.number,
    body: comment
  });

  // If passed: close current issue and open next one
  if (results.passed) {
    // Close current issue
    await github.rest.issues.update({
      owner, repo,
      issue_number: currentIssue.number,
      state: 'closed'
    });

    // Open next issue if there is one
    const nextStep = currentStep + 1;
    const nextIssueData = issues.find(function(i) { return i.step === nextStep; });

    if (nextIssueData) {
      // Ensure labels exist
      for (const label of nextIssueData.labels) {
        try {
          await github.rest.issues.getLabel({ owner, repo, name: label });
        } catch (e) {
          await github.rest.issues.createLabel({
            owner, repo,
            name: label,
            color: label === 'oppgave' ? '0075ca' : 'e4e669'
          });
        }
      }

      await github.rest.issues.create({
        owner, repo,
        title: nextIssueData.title,
        body: nextIssueData.body,
        labels: nextIssueData.labels
      });
    }

    // Update progress badge in README
    try {
      const solved = currentStep;
      const badgeUrl = `https://img.shields.io/badge/Løst-${solved}%2F8_issues-blue?style=flat-square`;
      const readmeResp = await github.rest.repos.getContent({ owner, repo, path: 'README.md' });
      const readmeContent = Buffer.from(readmeResp.data.content, 'base64').toString('utf8');
      const updated = readmeContent.replace(
        /https:\/\/img\.shields\.io\/badge\/Løst-\d+%2F8_issues-blue\?style=flat-square/,
        badgeUrl
      );
      if (updated !== readmeContent) {
        await github.rest.repos.createOrUpdateFileContents({
          owner, repo,
          path: 'README.md',
          message: `Oppdater fremgang: ${solved}/8 løst`,
          content: Buffer.from(updated).toString('base64'),
          sha: readmeResp.data.sha
        });
      }
    } catch (err) {
      core.warning(`Could not update progress badge: ${err.message}`);
    }
  }
};
