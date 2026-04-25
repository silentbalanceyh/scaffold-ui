# Ux — Form Operations

> Source: `src/ux/unity.interface.*.js`

| Function | Purpose |
|----------|---------|
| `formHits(reference, key)` | Read form hit config |
| `formOut(reference)` | Extract form values (output) |
| `valueRequest(values, reference)` | Build request from form values |
| `formClear(reference)` | Clear form fields |
| `formRead(reference)` | Read form values |
| `formGet(reference, key)` | Get single form field |
| `formReset(reference)` | Reset form to initial |
| `formRow(reference, key)` | Get form row config |
| `formHit(reference, key)` | Set form hit state |
| `initFn(reference, key, fn)` | Initialize function |
| `formInit(reference, config)` | Initialize form with config |
| `formLinker(reference, linker)` | Set form linker |
| `valueMap(values, mapper)` | Map form values |
| `formEnd(reference)` | Finalize form |

## Ant Design V4

| Function | Purpose |
|----------|---------|
| `v4Icon(icon)` | Render Ant Design icon |
| `v4FormFailure(form, errors)` | Set form validation errors |
| `v4ChildItem(item, reference)` | Render child item |
| `v4Items(items, reference)` | Render items array |
