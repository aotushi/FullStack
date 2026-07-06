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
- [Design guidelines](./design-guidelines.md)
- [frontend_vue](../frontend_vue/)
- [frontend_react](../frontend_react/)
