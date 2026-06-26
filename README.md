# FullStack

个人全栈开发知识库。

这个仓库使用 VitePress 组织和发布笔记。正式网站内容位于 [docs](./docs/)；根目录只保留工程入口、AI 入口文档和构建配置。

## Structure

- [docs/index.md](./docs/index.md) - 网站首页。
- [docs/.vitepress/config.ts](./docs/.vitepress/config.ts) - VitePress 配置。
- [docs/archive/MIGRATION_MAP.md](./docs/archive/MIGRATION_MAP.md) - 第一轮旧目录迁移记录。
- [AGENTS.md](./AGENTS.md) - Codex 工作入口。
- [CLAUDE.md](./CLAUDE.md) - Claude Code 工作入口。

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
npm run docs:build
npm run docs:preview
```

CodeLab local mode:

```bash
npm run dev
```

`npm run dev` starts both VitePress and the local CodeLab server. It uses project-local defaults starting from `5180` for VitePress and `4180` for the CodeLab API, then falls forward if a port is already occupied. The VitePress site can display CodeLab examples without the local server, but the lab server enables saving lab files, installing lab dependencies, and running each lab's local dev server for iframe preview.

For troubleshooting, `npm run docs:dev` and `npm run labs:server` can still be started separately.

## Git Workflow

- Use branches for non-trivial work.
- Keep structural migration, content rewriting, and deployment/config changes in separate branches when possible.
- Suggested branch names: `migration/<scope>`, `docs/<topic>`, `site/<change>`, `chore/<change>`.
- Match commit messages to branch intent: `migration: ...`, `docs: ...`, `site: ...`, or `chore: ...`.
- Before committing, verify that the current branch matches the work type.
- Run `npm run docs:build` before merging site structure or content changes.

## GitHub Automation

- Pull requests run [docs-build](./.github/workflows/docs-build.yml).
- PRs labeled `automerge` enable GitHub auto-merge after required checks and reviews pass.
- Branch protection guidance lives in [.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md).
- Code ownership rules live in [.github/CODEOWNERS](./.github/CODEOWNERS).

## Migration Rules

- Move old content by directory first. Do not rewrite or split article content during the first migration pass.
- Keep old content under the closest matching topic's `legacy/` directory.
- `legacy/` content is excluded from VitePress builds until it is reviewed and rewritten.
- Use `docs/archive/` only for content that cannot yet be classified or may later be deleted.
- Do not create catch-all folders such as `misc`, `notes`, `resources`, `temp`, or `learning-system`.
- External links belong inside the article or topic README that uses them.
