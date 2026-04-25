# Ux — Ajax (HTTP Methods)

> Source: `src/ux/interface.ajax.js`
> NOT axios — zero-ui uses native Fetch API.

## HTTP Methods

| Function | HTTP | Auth | Purpose |
|----------|------|------|---------|
| `ajaxFetch(uri, params, options)` | GET | No | Open data read |
| `ajaxPush(uri, params, options)` | POST | No | Open data write |
| `ajaxGet(uri, params, options)` | GET | Yes | Authenticated read |
| `ajaxPost(uri, params, options)` | POST | Yes | Authenticated write |
| `ajaxPut(uri, params, options)` | PUT | Yes | Authenticated update |
| `ajaxDelete(uri, params, options)` | DELETE | Yes | Authenticated delete |
| `ajaxResource(uri)` | GET | No | Same-origin read (no ENDPOINT prefix) |
| `ajaxUpload(uri, file, options)` | POST | Yes | File upload (FormData) |
| `ajaxDownload(uri, params, options)` | GET | Yes | Binary download |
| `ajaxPull(uri, params, options)` | POST | Yes | Binary download (POST body) |

## Microservice Methods

| Function | HTTP | Auth | Purpose |
|----------|------|------|---------|
| `microFetch(service, uri, params)` | GET | No | Microservice open read |
| `microPush(service, uri, params)` | POST | No | Microservice open write |
| `microGet(service, uri, params)` | GET | Yes | Microservice auth read |
| `microPost(service, uri, params)` | POST | Yes | Microservice auth write |
| `microPut(service, uri, params)` | PUT | Yes | Microservice auth update |
| `microDelete(service, uri, params)` | DELETE | Yes | Microservice auth delete |

## Auto-Attached Request Headers

| Header | Source |
|--------|--------|
| `X-App-Key` | Stored app config |
| `X-App-Id` | Stored app config |
| `X-Sigma` | Stored app config |
| `X-Tenant-Id` | Stored app config |
| `X-Lang` | `Z_LANGUAGE` env |
| `Authorization` | Bearer token (secure calls) |
| `Content-Type` | `application/json` or `application/octet-stream` |
