# Ux — Data Operations & Iterators

> Source: `src/ux/interface.abyss.js`

## Data Operations

| Function | Purpose |
|----------|---------|
| `clone(source)` | Deep clone |
| `assign(target, ...sources)` | Immutable merge |
| `onClick(reference, fn)` | Safe click handler |
| `onForm(reference, fn)` | Safe form handler |
| `prevent(event)` | Prevent default + stop propagation |
| `remove(array, predicate)` | Immutable array remove |
| `immutable(data)` | Freeze object deeply |
| `bind(fn, ...args)` | Partial application |
| `fn(reference)` | Identity function wrapper |
| `of(reference)` | Of wrapper for chaining |
| `supplier(fn)` | Supplier pattern |

## Iterators

| Function | Purpose |
|----------|---------|
| `itMatrix(matrix, fn)` | Iterate 2D matrix |
| `itObject(obj, fn)` | Iterate object entries |
| `executor(array, fn)` | Execute function array |
| `itUi(reference, fn)` | Iterate UI children |
| `itemFun(item, fn)` | Apply function to item |
| `itRow(record, fn)` | Iterate table row |
| `itElement(elements, fn)` | Iterate element array |
| `fnPredicate(data, predicate)` | Filter with predicate |
| `itFull(data, fn)` | Full iteration |
| `fieldFun(field, fn)` | Apply function to field |
| `parsePlugin(data)` | Parse plugin data |
| `itValue(value, fn)` | Apply function to value |
| `itTree(tree, fn)` | Iterate tree nodes |
| `itAmb(ambient, fn)` | Iterate ambient data |
| `itRepeat(data, fn)` | Iterate with repeat |
