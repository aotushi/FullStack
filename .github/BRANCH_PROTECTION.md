# Branch Protection

The GitHub repository is `aotushi/allDo`.

Configured default branch: `master`.

Rules:

- Require a pull request before merging.
- Require status checks to pass before merging.
- Required check: `docs-build`.
- Require branches to be up to date before merging.
- Require review from Code Owners when practical.
- Allow auto-merge at repository level.
- Delete head branches after merge at repository level.
- Do not allow bypassing these settings unless intentionally maintaining the repository.

Repository settings:

```bash
gh api \
  --method PATCH \
  /repos/aotushi/allDo \
  -f allow_auto_merge=true \
  -f delete_branch_on_merge=true \
  -f allow_squash_merge=true
```

Branch protection:

```bash
cat <<'JSON' | gh api --method PUT /repos/aotushi/allDo/branches/master/protection --input -
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["docs-build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": false,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON
```

This configuration has been applied once via GitHub CLI. Keep this file as the expected policy for future verification.
