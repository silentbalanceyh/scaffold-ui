# Ux — Debug & Entity Helpers

> Source: `src/ux/interface.element.js`

## Entity / Redux Helpers

| Function | Purpose |
|----------|---------|
| `rxDatum(reference, key)` | Reactive datum read |
| `createAction(type, payload)` | Create Redux action |
| `dataOut(state)` | Read from Redux (StateOut) |
| `dataIn(state)` | Write to Redux (StateIn) |
| `dataCab(reference, name)` | Read Cab.json config |
| `rxEtat(file)` | HOC config builder (= Ux.rxEtat) |
| `rxAssist(reference, key)` | Reactive assist data |

## Debug Functions

| Function | Purpose |
|----------|---------|
| `dgRouter(reference)` | Debug router props |
| `dgDebug(data, ...keys)` | Debug data |
| `dgQr(query)` | Debug QQuery |
| `dgAdmit(reference)` | Debug admission |
| `dgAjax(response)` | Debug ajax response |
| `dgFileJson(path)` | Debug JSON file |
| `dgFile(path)` | Debug file |
| `dgQuery(query)` | Debug query |
| `dgGraphic(data)` | Debug graphic data |
| `dgDiff(left, right)` | Debug diff |
| `dgTodo(items)` | Debug todo list |
| `dgJs(object, label, color)` | Debug JS object |
| `dgSkip(reference)` | Debug skip |
