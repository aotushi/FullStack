# frontend_vue

Scope: Vue project architecture, component engineering, client/server state, routing, permission, UI system integration, engineering delivery, quality, and maintenance.

This topic should not become a second copy of the Vue documentation. Vue official docs explain APIs; this topic records project-facing decisions, tradeoffs, patterns, and review notes.

Subtopics:

- `01_core_model/` - reactivity, Composition API, lifecycle, and core concepts rewritten as personal understanding.
- `02_components/` - component design, component wrapper, reusable component library, third-party component adaptation.
- `03_client_state/` - props/emits, component communication, Pinia, local state, persisted state.
- `04_server_state/` - Axios/Fetch wrapper, API layer, cache, retry, request cancellation, error handling.
- `05_routing/` - Vue Router, layouts, nested routes, navigation guards.
- `06_auth_permission/` - auth flow, dynamic menu, permission directives, route permission.
- `07_ui_system/` - UI library integration, theme, forms, dialogs, tables, i18n.
- `08_engineering/` - Vite, env config, build, deployment, CI, auto imports, code generation.
- `09_quality/` - testing, debugging, performance, observability.
- `10_maintenance/` - upgrades, refactoring, dependency governance, technical debt.

Current rewritten notes:

- [组件封装](./02_components/component-wrapper.md)

Legacy content:

- `legacy/` stores moved old notes before rewriting.
