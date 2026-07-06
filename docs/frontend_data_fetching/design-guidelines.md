# Design guidelines

This page records project-level rules for using requests in frontend applications.

## API Client Structure

- where API modules live
- base URL configuration
- typed request and response contracts
- separating transport code from domain API functions
- keeping wrappers thin and explicit

## Authentication And Credentials

- bearer tokens
- cookie credentials
- CSRF-related request rules
- `credentials` behavior
- authenticated request headers
- handling `401` and `403`

## Error Handling

- network errors
- HTTP errors
- validation errors
- business errors
- retryable and non-retryable failures
- user-facing error messages

## Timeout, Retry, And Cancellation

- request timeout
- cancellation
- cancel-on-unmount
- retry policy
- exponential backoff
- idempotency and side effects
- preventing stale responses from updating the UI
- request race handling

## UI State

- loading
- empty
- error
- success
- background refetching
- stale data

## Upload And Download

- `FormData`
- multipart upload
- upload progress
- blob and array buffer responses
- file download naming

## Pagination And Cache

- pagination
- infinite loading
- cache keys
- request deduplication
- optimistic updates

## Testing And Mocking

- MSW for request-level mocks
- adapter-level mocks for request clients
- fixture data shape
- testing loading, error, empty, success, and retry states
- keeping framework test helpers in their framework topics

Related:

- [Fundamentals](./fundamentals.md)
- [Clients](./clients.md)
- [frontend_vue](../frontend_vue/)
- [frontend_react](../frontend_react/)
