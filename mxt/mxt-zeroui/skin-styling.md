# Skin — Theme & Styling

> Source: `src/skin/`
> Import: `import Sk from 'skin';`

## Sk.mix API

`Sk.mix(className, reference)` — Merges CSS class names with skin theme overrides.

## Style Directories

| Directory | Purpose |
|-----------|---------|
| `src/skin/` | Theme system (framework-owned, do not modify) |
| `src/style/` | Custom SCSS (application-level, editable) |

## Z_CSS_* Environment Variables

| Variable | Purpose |
|----------|---------|
| `Z_CSS_PREFIX` | CSS class name prefix |
| `Z_CSS_FONT` | Font family override |
| `Z_CSS_PRIMARY` | Primary color |
| `Z_CSS_SUCCESS` | Success color |
| `Z_CSS_WARNING` | Warning color |
| `Z_CSS_ERROR` | Error color |
| `Z_CSS_FONT_SIZE` | Base font size |
| `Z_CSS_RADIUS` | Border radius |
| `Z_CSS_HEADER` | Header height |
