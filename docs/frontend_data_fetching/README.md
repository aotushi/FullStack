# frontend_data_fetching

Scope: Frontend data fetching and API client design across browser request basics, request libraries, framework integration, and project-level request rules.

This topic owns the shared knowledge behind frontend requests. Framework folders such as `frontend_vue` and `frontend_react` should only keep framework-specific integration notes.

Ownership rules:

- `frontend_browser` owns browser platform mechanics: CORS preflight, same-origin enforcement, network-layer behavior, and `Request`, `Response`, and `Headers` as browser APIs. This topic owns how application code uses those constraints to move data.
- This topic owns server-state concepts such as cache keys, staleness, invalidation, deduplication, and refetch policy. Framework folders own adapter usage such as Vue Query bindings, React hooks, Nuxt `useFetch`, and framework-specific server-state patterns.
- Fundamentals owns lifecycle primitives and vocabulary such as `AbortController`, `AbortSignal`, timeout, retry boundary, and stale responses. Design guidelines own project patterns such as cancel-on-unmount, dropping stale responses, and request race handling.

Subtopics:

- [Fundamentals](./fundamentals.md) - request and response model, request data, response data, browser boundaries, lifecycle control, and debugging.
- [Clients](./clients.md) - Fetch API, XMLHttpRequest, fetch-based wrappers, axios usage examples, framework clients, and the library-neutral role of server-state tools.
- [Design guidelines](./design-guidelines.md) - API client structure, authentication, error handling, retry, cancellation, upload/download, pagination, cache, and request mocking.

Related topics:

- [frontend_browser](../frontend_browser/) - browser network APIs, CORS, request and response primitives.
- [frontend_javascript](../frontend_javascript/) - Promise, async/await, JSON, and language-level async behavior.
- [frontend_vue](../frontend_vue/) - Vue composables, Pinia usage, TanStack Query Vue, and Nuxt data fetching.
- [frontend_react](../frontend_react/) - React hooks and React-specific server-state patterns.

Legacy content:

- `legacy/` stores moved old notes before rewriting.
