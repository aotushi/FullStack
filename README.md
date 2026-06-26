# FullStack

个人全栈开发知识库。

这个仓库使用 VitePress 组织和发布笔记。正式网站内容位于 [docs](./docs/)；根目录只保留工程入口、AI 入口文档和构建配置。

## Structure

- [docs/index.md](./docs/index.md) - 网站首页。
- [docs/.vitepress/config.ts](./docs/.vitepress/config.ts) - VitePress 配置。
- [docs/archive/MIGRATION_MAP.md](./docs/archive/MIGRATION_MAP.md) - 第一轮旧目录迁移记录。
- [AGENTS.md](./AGENTS.md) - Codex 工作入口。
- [CLAUDE.md](./CLAUDE.md) - Claude Code 工作入口。

Topic directory rule:

- `index.md` is the public VitePress overview page for a topic route such as `/frontend_data_fetching/`.
- `README.md` records topic scope, subtopics, and migration notes. It can mirror `index.md` while the topic is small.
- `legacy/` stores old moved content before review and rewriting.
- Sidebar entries for topics with subpages should be collapsible groups with `Overview` plus child links, not a single parent-only link.

## Topic Groups

- `docs/web_*`
- `docs/frontend_*`
- `docs/backend_*`
- `docs/client_*`
- `docs/devops_*`
- `docs/projects`
- `docs/archive`

## Commands

```bash
npm install
npm run dev
npm run format:check
npm run docs:build
npm run docs:preview
```

CodeLab local mode:

```bash
npm run dev
```

`npm run dev` starts both VitePress and the local CodeLab server. It uses project-local defaults starting from `5180` for VitePress and `4180` for the CodeLab API, then falls forward if a port is already occupied. The VitePress site can display CodeLab examples without the local server, but the lab server enables saving lab files, installing lab dependencies, and running each lab's local dev server for iframe preview.

For troubleshooting, `npm run docs:dev` and `npm run labs:server` can still be started separately.

Formatting:

```bash
npm run format
npm run format:check
```

Formatting uses Oxfmt. Legacy notes, archive content, generated output, and lab dependency folders are ignored so formatting can be introduced without rewriting old migrated material.
Vite+ manages the formatter and staged-file hook configuration from [vite.config.ts](./vite.config.ts).
After `npm install`, the project installs a pre-commit hook under `.vite-hooks/` that runs `npm run staged`.

## Git Workflow

- `master` is the stable branch and deployment source.
- `docs/update` is the long-lived branch for normal document updates.
- Use short-lived branches for non-trivial structure, site tooling, deployment, or migration work.
- Keep structural migration, content rewriting, and deployment/config changes in separate branches when possible.
- Suggested branch names: `migration/<scope>`, `docs/<topic>`, `site/<change>`, `chore/<change>`.
- Match commit messages to branch intent: `migration: ...`, `docs: ...`, `site: ...`, or `chore: ...`.
- Before committing, verify that the current branch matches the work type.
- Pre-commit runs `npm run staged` for staged files.
- Run `npm run format:check` before larger site code, examples, or config changes.
- Run `npm run docs:build` before merging site structure or content changes.
- PRs from `docs/update` use merge commits and keep the branch alive. After `master` updates, GitHub Actions fast-forwards `docs/update` back to `master`.
- PRs from short-lived branches use squash merge and delete the branch after merge.

## GitHub Automation

- Pull requests run [docs-build](./.github/workflows/docs-build.yml).
- PRs labeled `automerge` enable GitHub auto-merge after required checks and reviews pass.
- [sync-docs-update](./.github/workflows/sync-docs-update.yml) keeps the long-lived `docs/update` branch aligned with `master`.
- Branch protection guidance lives in [.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md).
- Code ownership rules live in [.github/CODEOWNERS](./.github/CODEOWNERS).

## Migration Rules

- Move old content by directory first. Do not rewrite or split article content during the first migration pass.
- Keep old content under the closest matching topic's `legacy/` directory.
- `legacy/` content is excluded from VitePress builds until it is reviewed and rewritten.
- Use `docs/archive/` only for content that cannot yet be classified or may later be deleted.
- Do not create catch-all folders such as `misc`, `notes`, `resources`, `temp`, or `learning-system`.
- External links belong inside the article or topic README that uses them.
