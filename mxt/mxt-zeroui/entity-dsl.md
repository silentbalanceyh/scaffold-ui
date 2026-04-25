# Entity — Dsl & Etat Builder

> Source: `src/entity@em/Dsl.ts` + `src/entity@em/rx/Rx.Etat.ts`
> Import: `import { Dsl, DataObject, DataArray } from 'entity';`

## Dsl Static Methods

| Method | Returns | Purpose |
|--------|---------|---------|
| `Dsl.getObject(data)` | `DataObject` | Fluent object wrapper with i18n |
| `Dsl.getArray(data)` | `DataArray` | Fluent array wrapper |
| `Dsl.get(data)` | `DataContainer` | Auto-detect Object/Array |
| `Dsl.getRouter(props, meta)` | `DataRouter` | V5-compatible router wrapper |
| `Dsl.getNavigator(input)` | `Navigator` | Navigation data |
| `Dsl.getEvent(data)` | `DataEvent` | Event data wrapper |
| `Dsl.getQuery(query, ref)` | `QQuery` | Query builder (from zmr) |
| `Dsl.createIn(state, cb)` | `StateIn` | State write builder |
| `Dsl.createOut(state)` | `StateOut` | State read builder |
| `Dsl.rxEtat(file)` | `Etat` | HOC config builder (= Ux.rxEtat) |
| `Dsl.of(reference)` | `RxOf` | Reactive reference wrapper |
| `Dsl.codex(reference)` | `RxCodex` | Codex reference wrapper |
| `Dsl.isArray(data)` | boolean | Check if DataArray |

## Etat Builder Chain

`Ux.rxEtat(require('./Cab.json'))` returns an Etat builder. Chain methods, end with `.to()`.

| Method | Purpose | Example |
|--------|---------|---------|
| `.cab("UI")` | Bind i18n namespace | `.cab("UI")` |
| `.form()` | Bind Ant Design Form | `.form()` |
| `.loading("app")` | Set loading key | `.loading("app")` |
| `.connect(mapState)` | Map state to props | `.connect(s => Ux.dataIn(s).revamp(["app"]).to())` |
| `.connect(mapDispatch, true)` | Map dispatch to props | `.connect({ fnOut: Ux.fnOut }, true)` |
| `.state({})` | Set initial local state | `.state({ $collapsed: false })` |
| `.raft(4)` | Raft form layout (N columns) | `.raft(4)` |
| `.op(key, fn)` | Bind single $op handler | `.op("save", onSave)` |
| `.bind(OP)` | Bind all $op handlers | `.bind(Op)` |
| `.ready(fn)` | Pre-render data prep | `.ready(readyFn)` |
| `.mock(data)` | Mock data for dev | `.mock({ key: "value" })` |
| `.init(fn)` | Init callback | `.init(initFn)` |
| `.search(config)` | Configure search panel | `.search(searchConfig)` |
| `.tree(config)` | Configure tree panel | `.tree(treeConfig)` |
| `.unmount(fn)` | Cleanup on unmount | `.unmount(cleanupFn)` |
| `.logger(enabled)` | Enable logging | `.logger(true)` |
| `.to()` | **FINALIZE** (always last) | `.to()` |

## @Ux.zero Decorator Pattern

```jsx
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI").loading("app")
    .connect(state => Ux.dataIn(state).revamp(["app"]).to())
    .connect({ fnOut: Ux.fnOut }, true)
    .state({ $collapsed: false })
    .to())
class PageComponent extends React.PureComponent { ... }
export default PageComponent;
```

## State Update Pattern

```js
Ux.of(reference).in(state).ready().done()
// Equivalent:
Dsl.createIn(state, (s) => { /* mutations */ }).to()
```
