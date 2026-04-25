# Environment — Z_* Variables

## Core

| Variable | Required | Description |
|----------|----------|-------------|
| `Z_APP` | YES | Backend application identifier |
| `Z_ENDPOINT` | YES | Backend API URL |
| `Z_K_SESSION` | YES | Unique session storage prefix |

## Entry Points

| Variable | Default | Description |
|----------|---------|-------------|
| `Z_ENTRY_LOGIN` | `/login/index` | Login page route |
| `Z_ENTRY_ADMIN` | `/main/index` | Admin page route |

## Development

| Variable | Description |
|----------|-------------|
| `Z_LANGUAGE` | `cn` or `en` |
| `Z_PORT` | Dev server port |

## Plugin & Instance

| Variable | Description |
|----------|-------------|
| `Z_PLUGIN` | Plugin mode flag |
| `Z_INSTANCE` | Multi-instance identifier |
| `Z_MODE` | Application mode |

## Styling

| Variable | Description |
|----------|-------------|
| `Z_CSS_PREFIX` | CSS class prefix |
| `Z_CSS_FONT` | Font family |
| `Z_CSS_PRIMARY` | Primary color |
| `Z_CSS_SUCCESS` | Success color |
| `Z_CSS_WARNING` | Warning color |
| `Z_CSS_ERROR` | Error color |
| `Z_CSS_FONT_SIZE` | Base font size |
| `Z_CSS_RADIUS` | Border radius |
| `Z_CSS_HEADER` | Header height |

## File

`.env.development` — local dev config
`.env.production` — production build config
