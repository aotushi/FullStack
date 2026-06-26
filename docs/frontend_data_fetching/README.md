# frontend_data_fetching

Scope: Frontend data fetching and API client design across browser request basics, request libraries, framework integration, and project-level request rules.

This topic owns the shared knowledge behind frontend requests. Framework folders such as `frontend_vue` and `frontend_react` should only keep framework-specific integration notes.

Subtopics:

- [Fundamentals](./fundamentals.md) - request and response model, request data, response data, browser boundaries, lifecycle control, and debugging.
- [Clients](./clients.md) - Fetch API, XMLHttpRequest, fetch-based wrappers, axios, framework clients, and server-state tools.
- [Design guidelines](./design-guidelines.md) - API client structure, authentication, error handling, retry, cancellation, upload/download, pagination, cache, and framework boundaries.

Related topics:

- [frontend_browser](../frontend_browser/) - browser network APIs, CORS, request and response primitives.
- [frontend_javascript](../frontend_javascript/) - Promise, async/await, JSON, and language-level async behavior.
- [frontend_vue](../frontend_vue/) - Vue composables, Pinia usage, TanStack Query Vue, and Nuxt data fetching.
- [frontend_react](../frontend_react/) - React hooks and React-specific server-state patterns.

Legacy content:

- `legacy/` stores moved old notes before rewriting.
