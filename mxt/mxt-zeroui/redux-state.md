# Redux — Store & State

## Store Shape

```js
{
    app: {},        // App config (sigma, tenantId, appKey)
    user: {},       // Current user data
    [moduleKey]: {} // Module-specific state
}
```

## Middleware

- `redux-observable` — Epic middleware for async flows
- Redux 4 standard middleware chain

## Reducers

| Reducer | Purpose |
|---------|---------|
| App reducer | App config state |
| Module reducer | Per-module state (keyed by module name) |
| Combiner reducer | Combines all module reducers |

## Action Flow

```
Component dispatch → Epic (async) → Store update → Props (connect) → Re-render
```

## Required App Files

| File | Purpose |
|------|---------|
| `src/app/action/types.js` | Action type constants |
| `src/app/action/index.js` | Action creators |
| `src/app/action/epic.js` | Epics (async side effects) |
| `src/app/action/combiner.js` | Reducer combiner |

## State Access

```js
Ux.dataIn(state).revamp(["app"]).to()   // Read from store
Ux.of(ref).in(state).ready().done()     // Write to store
```
