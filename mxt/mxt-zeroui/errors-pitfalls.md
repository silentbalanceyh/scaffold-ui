# Error Codes & Common AI Pitfalls

## Ex Module Error Codes

| Code | Description |
|------|-------------|
| -200001 | App config (`X_APP`) read failure |
| -200002 | Component not wrapped with Ant Design Form |
| -200003 | Flow must be async Promise, none detected |
| -200004 | `yl` init flow requires Promise type |
| -200005 | Function binding failure — not valid Function |
| -200006 | Parameter length error (must be 1, 2, or 3) |
| -200007 | `fnEvent` must be a valid function |
| -200008 | `fnSearch` Qr function — `$query` format invalid |
| -200009 | Promise pre-condition not met |

## Top 10 AI Mistakes

1. **Importing from internal modules** — Use `Ux`, `Ex`, `Ui`, NOT `zone`, `zi`, `zo`
2. **Using axios** — zero-ui uses native Fetch, NOT axios
3. **Creating forms in JSX** — Use Cab.json config + ExForm or Ui.smartForm
4. **Hardcoding menus** — Menus are backend-driven via `Ex.I.menus()`
5. **Skipping i18n** — Always use `@Ux.zero` with `.cab()` and `Lg()`
6. **Direct state mutation** — Use `Dsl.createIn()` / `Ux.of().in().ready().done()`
7. **Importing Ex from plugin code** — Circular dependency; use Ux instead
8. **Ignoring ACL** — Use `Ux.aclOp()`, `Ux.aclData()`, `Ux.aclSubmit()`
9. **Writing plain React components** — Always use `@Ux.zero` HOC for page-level
10. **Forgetting `.to()`** — `Ux.rxEtat()` builder MUST end with `.to()`

## Common Misconceptions

| Misconception | Reality |
|---|---|
| "I need to import axios" | zero-ui uses native Fetch API with custom wrapper |
| "I'll create a form with JSX fields" | Use Cab.json + ExForm/smartForm |
| "Menus are defined in frontend" | Menus come from backend `Ex.I.menus()` |
| "I can import from `zo` for ajax" | Use `Ux.ajaxGet()` etc. instead |
| "Ox and Ex are the same" | Ox reads config from API; Ex reads from Cab.json |
| "I can modify framework internals" | Only modify `app/`, `container/`, `components/`, `cab/` |
| "Plugin can import Ex" | Circular dependency — use Ux in plugin code |
