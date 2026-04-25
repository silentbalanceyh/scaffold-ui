# Ux — xweb (React Component Helpers)

> Source: `src/ux/interface.xweb.js`

| Function | Purpose |
|----------|---------|
| `xtLazyInit(reference, key, fn)` | Lazy initialization |
| `xtLazyUp(reference, key, fn)` | Lazy update |
| `xtLazyAjax(reference, key, fn)` | Lazy ajax |
| `xtReady(reference, state)` | Check ready state (prevent async render errors) |
| `xtReset(reference)` | Reset state |
| `xtRevert(reference, key)` | Revert state |
| `xtGet(reference, path)` | Get nested state |
| `xtSet(reference, path, value)` | Set nested state |
| `xtInitObject(reference, key, value)` | Initialize object state |
| `xtInitArray(reference, key, value)` | Initialize array state |
| `xtInitArrayMap(reference, key, value)` | Initialize array map state |
| `xtInitFormat(reference, key, value)` | Initialize format state |
| `xtFormat(reference, key, fn)` | Format value |
| `xtRender(reference, key, fn)` | Render helper |
| `xtChecked(reference, key)` | Checked state helper |
| `xtUnsafe(reference, key)` | Unsafe state access |
| `xtExprFlat(reference, key)` | Expression flatten |
| `xtRowAdd(reference, key, row)` | Add table row |
| `xtRowChange(reference, key, index, row)` | Change table row |
| `xtTransfer(reference, key, data)` | Transfer data |
| `xtUploadHandler(reference, key)` | Upload handler |
| `xtUploadInit(reference, key)` | Initialize upload |
| `xtUploadMime(reference, key)` | Upload MIME check |
