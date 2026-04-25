# Auth & ACL (Frontend)

## Auth Flow

1. Login: `Ex.I.login(params)` → `Ex.I.token(params)` (OAuth2 authorization code)
2. Token stored: browser storage keyed by `Z_K_SESSION` prefix
3. Secure API calls: `Authorization: Bearer <token>` header auto-attached
4. App config (sigma, tenantId, appKey): stored and attached to every request

## ACL Functions

| Function | Purpose |
|----------|---------|
| `Ux.aclOp(options, ops)` | ACL check for operations — which buttons to show |
| `Ux.aclData($inited, reference, $edition)` | ACL check for data — field-level editability |
| `Ux.aclSubmit(params, reference)` | ACL check before form submission |
| `Ux.digitToken()` | Get current JWT token |
| `Ux.digitSign(uri, method, params)` | Generate RESTful digital signature |

## Development Bypass

When `security.development.header-name` and `header-value` are set, the login flow can be bypassed for local development.

## Data Record Convention

| Field | Type | Meaning |
|-------|------|---------|
| `key` | Any | Primary key |
| `name` | String | Display name (repeatable) |
| `code` | String | System code (unique) |
| `active` | Boolean | Enabled/disabled |
| `language` | String | Default `cn` |
| `sigma` | String | Multi-tenant identifier |
| `createdAt` | Date | Created time |
| `createdBy` | String | Creator ID |
| `updatedAt` | Date | Last update time |
| `updatedBy` | String | Updater ID |
| `appKey` | String | App identifier (optional) |
| `appId` | String | App ID (optional) |
