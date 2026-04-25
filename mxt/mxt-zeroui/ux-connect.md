# Ux — Connect, DataIO, Depend & Plugin Element

> Source: `src/ux/unity.interface.connect.js` + `unity.interface.data.io.js` + `unity.interface.depend.js` + `unity.interface.plugin.element.js`

## Connect

| Function | Purpose |
|----------|---------|
| `connectId(reference, id)` | Connect by ID |
| `connectItem(reference, key)` | Connect by item key |

## Data IO

| Function | Purpose |
|----------|---------|
| `dataIo(reference)` | Bidirectional data IO |

## Depend (Write Linkers)

| Function | Purpose |
|----------|---------|
| `writeLinker(reference, key)` | Write linker dependency |
| `writeImpact(reference, key)` | Write impact dependency |

## Plugin Element

| Function | Purpose |
|----------|---------|
| `toForm(reference, config)` | Build form from plugin |
| `toFormUi(reference, config)` | Build form UI from plugin |
| `toFieldName(field)` | Get field name |
| `toLimit(config)` | Get limit config |
| `itField(fields, fn)` | Iterate plugin fields |
| `valueExpr(expr, data)` | Evaluate plugin expression |
| `valueFind(data, predicate)` | Find value in plugin data |
| `valueTran(data, transformer)` | Transform plugin value |
| `valueIndicate(data, key)` | Indicate plugin value |
