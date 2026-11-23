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

## Credential safety and one-time setup

**Do not create the token until the following protections are configured.**
The token can write to the deployment repository; treat it as a production
credential, even though this workflow never intentionally merges a PR.

1. In **steeple-stream → Settings → Environments**, create the
   `deployment-pr` environment. Under **Deployment branches and tags**,
   choose **Selected branches and tags** and allow **only `main`**.
   Never use the unrestricted "No restriction" option. The workflow's job
   explicitly uses this environment and runs only for `main`.
2. In **steeple-stream → Settings → Rules → Rulesets**, protect `main`:
   require a pull request, require the existing CI checks, and require review
   for changes to privileged workflow files. Restrict who may bypass these
   requirements. This is important because a new or modified workflow on
   `main` could read the environment secret.
3. In **steeple-stream-deploy → Settings → Rules → Rulesets**, require
   `Nix Check / nix` to pass and enforce review requirements for deployment
   changes. Existing rules require a PR but (as of November 2026) have no
   required checks and require zero approvals. **CI alone cannot prove
   that a deployment change is trustworthy.**
4. Prefer a dedicated **GitHub App identity** for PR creation when requiring
   an independent approval: the app authors the deployment PR and you can
   review/approve it. A fine-grained personal access token belonging to you
   authors PRs as you, and GitHub does **not** allow authors to approve their
   own PRs. With the PAT design, an additional reviewer would therefore be
   needed to enforce a one-approval requirement.

If using the fine-grained PAT shown in this PR:

- Resource owner: `connorbrinton`
- Repository access: **Only `steeple-stream-deploy`**
- Repository permissions: **Contents → Read and write** and
  **Pull requests → Read and write** (Metadata read is automatic)
- Use a short expiration and rotate/revoke the token if you suspect compromise.
  **Never use a classic PAT or a token scoped to all repositories.**

In **steeple-stream → Settings → Environments → deployment-pr → Environment
secrets**, add `STEEPLE_DEPLOY_PR_TOKEN`. **Do not add it as a repository
secret**, which is accessible to workflows on other branches. The workflow
checks out the public deployment repository without this PAT; the token
is passed only to the PR creation action, which is pinned to a full commit
SHA. Other third-party actions in this workflow are SHA-pinned as well.

This workflow does not accept untrusted PR code, does not use
`pull_request_target`, and has no branch-selectable manual trigger.
It updates `flake.lock` only. These protections reduce exposure but **do
not make a repository-write token incapable of misuse**: an attacker who
obtains it may be able to manipulate or merge deployment PRs unless the
deployment branch rules prevent it.

## After setup

1. Merge this application workflow PR **after** creating the protected
   environment and storing its secret.
2. That merge to application `main` triggers the proposal immediately.
   If the deployment pin has already caught up, no PR is necessary.
3. After subsequent merges to application `main`, verify that a PR appears
   in **steeple-stream-deploy**, passes its Nix Check, and is reviewed before
   merging to activate on the appliance.

The workflow keeps one deployment PR branch (`automation/update-steeple-stream`)
and refreshes it if additional application commits land before activation.
To test each feature independently, merge the deployment PR and verify it
before merging the next feature.

If no PR appears, check the application workflow's logs, environment branch
policy, and token expiration. Only `flake.lock` is changed by this workflow;
review its diff for unintended transitive dependency updates.

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
