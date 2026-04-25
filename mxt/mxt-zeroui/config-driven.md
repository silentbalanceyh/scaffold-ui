# Config-Driven Data Fetching

> Source: Cab.json `_assist` / `_magic` sections

## Pattern

Cab.json files define declarative data loading — no imperative fetch code needed.

```json
"_assist": {
    "my.todo": {
        "uri": "/api/todo/search",
        "method": "POST",
        "magic": {
            "status,i": "ENUM:PENDING",
            "sigma": "PROP:app.sigma",
            "userId": "USER:key"
        },
        "qr": true
    }
}
```

## Magic Expression Prefixes

| Prefix | Source | Example |
|--------|--------|---------|
| `ENUM:` | Enum value lookup | `ENUM:PENDING` |
| `PROP:` | App property | `PROP:app.sigma` |
| `USER:` | Current user property | `USER:key` |

## Parsing Functions

| Function | Purpose |
|----------|---------|
| `Ux.asyncMagic(magic, reference)` | Parse magic expressions into request params |
| `Ux.asyncAssist(assist, reference)` | Execute assist data loading |

## Form Configuration Files

| File | Purpose |
|------|---------|
| `UI.Add.json` | Add form field config |
| `UI.Edit.json` | Edit form field config |
| `UI.Filter.json` | Search filter field config |

## Raft Layout

`.raft(4)` in HOC config sets 4-column grid. Raft config supports:
- `renders` — custom field renderers
- `dynamic` — conditional field visibility

## Form API

| API | Purpose |
|-----|---------|
| `Ux.configForm(reference)` | Read form config from Cab.json |
| `Ux.form(ref)` | Form helper chain |
| `Ux.V4App` | Form context provider |
| `Ex.form()` | Standard form builder |
