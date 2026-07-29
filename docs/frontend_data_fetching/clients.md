# Clients

This page records the tools used to send requests from frontend applications.

## Native Browser Clients

- Fetch API
- XMLHttpRequest

`XMLHttpRequest` is mostly historical in new projects, but it still matters when reading old code, understanding older libraries, or handling browser upload progress patterns.

## Fetch-Based Wrappers

- ofetch
- ky
- VueUse `useFetch`

## Axios

- axios instance
- interceptors
- request and response transform
- upload and download progress
- timeout and cancellation

The Axios request-layer notes are built around a runnable, fully tested implementation kept in this repo at `docs/projects/axios-http`:

- [Overview](./clients/axios.md) - scope, protocol stance, capability defaults, and the pre-adoption checklist.
- [Learning path](./clients/axios/learning-path.md) - reading guide: the global request map, the eight-stage overview, and the three adoption tiers.
- Stage pages, each ending with the source files it lands: [最小客户端](./clients/axios/minimal-client.md), [逻辑请求与错误](./clients/axios/request-and-errors.md), [生命周期能力](./clients/axios/lifecycle.md), [认证与刷新](./clients/axios/auth.md), [业务模块与端到端](./clients/axios/modules-and-e2e.md).

## Framework Clients

- Nuxt `$fetch`
- Nuxt `useFetch`
- Vue integration notes
- React integration notes

## Server-State Tools

This topic owns the tool-agnostic role of server-state libraries: cache identity, staleness, invalidation, deduplication, and when a request library is not enough. Framework-specific APIs belong in their framework topics.

- TanStack Query
- SWR-like tools
- request library vs server-state library

Related:

- [Fundamentals](./fundamentals.md)
- [Axios](./clients/axios.md)
- [Design guidelines](./design-guidelines.md)
- [frontend_vue](../frontend_vue/)
- [frontend_react](../frontend_react/)
