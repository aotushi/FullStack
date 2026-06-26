# AGENTS.md

Guidance for Codex when working in this repository.

## Repository Purpose

This repository is named `FullStack`. It is a personal full-stack development knowledge base being rebuilt from an old, scattered notes repository into a topic-based system for Web, frontend, backend, client apps, DevOps, and project retrospectives.

The goal is not to preserve every old note. The goal is to keep material that can be rewritten into useful personal understanding, engineering notes, examples, or project reviews.

## Current Structure

Read [README.md](./README.md) and [docs/index.md](./docs/index.md) first. The VitePress site content lives under `docs/`.

Main topic groups:

- `docs/web_foundation`, `docs/web_security`
- `docs/frontend_*`
- `docs/backend_*`
- `docs/client_mobile`, `docs/client_desktop`
- `docs/devops_*`
- `docs/projects`
- `docs/archive`

Each topic directory under `docs/` should contain:

- `README.md` - topic scope, subtopics, and current migration notes.
- `legacy/` - old moved content awaiting review and rewriting.
- focused Markdown notes or subdirectories added later as content is rewritten.

## Migration Rules

- Do directory-level moves first. Do not split or rewrite old articles during structural migration unless explicitly requested.
- Keep old content under the closest matching topic's `legacy/` directory.
- `legacy/` content is excluded from VitePress builds until it is reviewed and rewritten.
- Use `archive/` only for content that cannot yet be classified or may later be deleted.
- Do not create catch-all folders such as `misc`, `notes`, `resources`, `temp`, or `learning-system`.
- External links belong in the note or topic README where they are actually used, not in a global resources directory.
- CS content is out of scope for this repository and should not be rebuilt here unless the user changes the repository scope.

Migration trace lives at [docs/archive/MIGRATION_MAP.md](./docs/archive/MIGRATION_MAP.md).

## Content Rules

When rewriting or creating notes:

- Prefer the user's own explanation, examples, mistakes, and project context over copied material.
- Keep copied external material as links plus short evaluation, not long pasted content.
- Preserve useful source attribution when old notes clearly came from external material.
- Keep topic names stable and flat at the top level.
- Put framework-specific state, routing, and patterns inside `frontend_vue` or `frontend_react`, not in separate top-level folders unless the user asks.
- Put build tooling in `frontend_build`; put production release and hosting operations in `devops_deploy`.

## Project Work

This repository may contain runnable practice projects under `docs/projects/legacy` or later `docs/projects/<name>`.

- Do not install dependencies or run project commands unless the user asks or the task requires it.
- Do not commit `node_modules`, build outputs, or generated dependency folders.
- Prefer project retrospectives and concise source snapshots over keeping full obsolete scaffolds.

## VitePress

- Site root: `docs/`
- Config: `docs/.vitepress/config.ts`
- `legacy/` content is excluded by `srcExclude`.
- Local dev: `npm run dev` starts both VitePress and the local CodeLab server. Defaults start from VitePress `5180` and CodeLab API `4180` to avoid common `5173` collisions with other VitePress projects.
- Troubleshooting: `npm run docs:dev` and `npm run labs:server` can still be run separately.
- Build: `npm run docs:build`
- Preview: `npm run docs:preview`
- Build output: `docs/.vitepress/dist`

## Formatting

- Formatter: Vite+ `vp fmt` backed by Oxfmt.
- Config: `vite.config.ts`.
- Check formatting: `npm run format:check`.
- Apply formatting: `npm run format`.
- Staged-file check: `npm run staged`.
- Pre-commit hook: `.vite-hooks/pre-commit`, installed by `npm run prepare`.
- Legacy notes, archive content, generated output, and lab dependency folders are intentionally ignored.
- Run `npm run format:check` before committing site code, examples, or config changes.

## Git Branch Workflow

- `master` is the stable branch and deployment source.
- Use `docs/update` as the long-lived branch for ordinary document updates.
- Use a dedicated short-lived branch for non-trivial structure, site tooling, deployment, or migration work.
- Keep structural migration, content rewriting, and deployment/config changes in separate branches when practical.
- Suggested branch names:
  - `docs/update` for ordinary document updates that should flow through the long-lived docs branch.
  - `migration/<scope>` for directory moves and legacy cleanup.
  - `docs/<topic>` for rewriting a topic, for example `docs/frontend-css`.
  - `site/<change>` for VitePress navigation, deployment, or theme changes.
  - `chore/<change>` for repository maintenance.
- Check `git status --short --branch` before editing and after changes.
- Do not commit directly to the default branch unless the user explicitly asks.
- Run `npm run docs:build` before merging site structure or published content changes.
- PRs from `docs/update` should be merged with a merge commit and must not delete the branch.
- PRs from short-lived branches can use squash merge and delete the branch after merge.
- The `sync-docs-update` GitHub Actions workflow fast-forwards `docs/update` after `master` changes.

When the user asks to commit:

- First verify that the current branch matches the work type. If it does not, create or switch to the right branch before committing.
- Use commit messages that match the branch intent:
  - `migration: ...` for directory moves, topic restructuring, and legacy placement.
  - `docs: ...` for rewritten notes or topic content.
  - `site: ...` for VitePress config, navigation, deployment, and theme work.
  - `chore: ...` for repository maintenance and tooling.
- Keep each commit focused on the branch purpose. Do not mix note rewriting with site deployment or broad migration unless the user explicitly asks.

## GitHub Automation

- Pull requests must pass `.github/workflows/docs-build.yml`.
- The `automerge` label enables `.github/workflows/enable-automerge.yml`, which uses GitHub auto-merge and waits for required checks/reviews.
- Pull requests from `docs/update` use `gh pr merge --auto --merge` so the long-lived branch history stays aligned with `master`.
- Pull requests from short-lived branches use `gh pr merge --auto --squash --delete-branch`.
- The `sync-docs-update` workflow uses `github-actions[bot]` Git identity for mechanical branch synchronization.
- Branch protection expectations are documented in `.github/BRANCH_PROTECTION.md`.
- CODEOWNERS lives at `.github/CODEOWNERS`.
- Do not weaken branch protection or broaden workflow permissions unless the user explicitly asks.

## Safety

- The working tree may be dirty from ongoing migration. Do not revert unrelated changes.
- Do not delete old content unless the user explicitly asks for deletion.
- For large moves, use `git status` before and after, and keep a migration note.
