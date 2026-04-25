# Ux — Store & Redux Write

> Source: `src/ux/unity.interface.*.js`

## Store Read

| Function | Purpose |
|----------|---------|
| `storeApp()` | Get app config from Redux store |
| `storeModule(key)` | Get module config from Redux store |
| `storeUser()` | Get user data from Redux store |
| `storeApp()` | Get app config from Redux store (alias) |

## Redux Write

| Function | Purpose |
|----------|---------|
| `writeTree(reference, key, data)` | Write tree data to Redux |
| `writeClean(reference, key)` | Clean Redux key |
| `writeSubmit(reference, key, data)` | Submit data to Redux |
