# Automatic deployment proposals

Application changes should follow the existing **develop → merge → deploy → test**
workflow. Once a feature is merged into the application's `main` branch, the
[Propose deployment](../.github/workflows/propose-deployment.yml) workflow starts
immediately. It checks out `connorbrinton/steeple-stream-deploy`, updates only
its `steeple-stream` Nix flake input, and creates or refreshes the deployment
pull request. No hourly schedule or polling is involved.

The deployment PR's **Nix Check** workflow runs normally. **Merging that PR
is still deliberate**, because comin watches deployment `main` and activates
the corresponding appliance generation. Do not enable auto-merge for deployment
PRs unless you intentionally want appliance activation to be automatic.

## One-time authentication setup

GitHub's built-in `GITHUB_TOKEN` cannot write to a different repository.
Create a **fine-grained personal access token** with:

- Resource owner: `connorbrinton`
- Repository access: **Only** `steeple-stream-deploy`
- Repository permissions: **Contents → Read and write** and
  **Pull requests → Read and write** (Metadata read is automatic)
- An appropriate expiration date (remember to renew it)

Store the token as the Actions repository secret `STEEPLE_DEPLOY_PR_TOKEN`
in **steeple-stream** (the *application* repository, not the deployment repo):
Settings → Secrets and variables → Actions → New repository secret.

A GitHub App installation token with the same repository permissions can
be used in place of the fine-grained PAT for non-user-owned automation.

## After setup

1. Merge the application workflow PR and configure the token.
2. Open **steeple-stream → Actions → Propose deployment of merged application
   changes → Run workflow** to test without waiting for a new feature.
3. If the deployment pin already matches application `main`, the workflow
   exits without opening a PR.
4. After the next merge to application `main`, verify that a PR appears in
   **steeple-stream-deploy** and that its Nix Check runs. Review and merge the
   deployment PR when ready to activate on the appliance.

The workflow keeps one deployment PR branch (`automation/update-steeple-stream`)
and updates it if additional application commits land before activation.
For testing individual features one at a time, merge and verify the
corresponding deployment PR before merging the next application feature.

If no deployment PR appears, inspect the application workflow run. Missing or
expired tokens fail explicitly. If `flake.lock` changes outside the targeted
Nix input, inspect the diff before merging; only `flake.lock` may be changed.

## Manual fallback

To deploy manually without automation, update the application flake input in
`steeple-stream-deploy`:

```sh
nix flake update steeple-stream
git add flake.lock
git commit -m "Update Steeple Stream"
```

Push that change as a deployment pull request and merge after the Nix build
passes. Avoid pushing directly to deployment `main` when there is an
active broadcast.
