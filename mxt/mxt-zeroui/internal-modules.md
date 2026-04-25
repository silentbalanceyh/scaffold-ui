# Internal Modules (Debug/Graph Only)

> FORBIDDEN for direct import. Listed for graph navigation and debugging only.
> Always use `Ux` or `entity` instead.

## Module Map

| Dir | Alias | English | Key Contents |
|-----|-------|---------|--------------|
| `zero/` | `zero` | Aeon Interface | `@Ux.zero` decorator, HOC builder |
| `zion/` | `zi` | Interact-Oriented Native | `@uca` annotation, Dialog, LoadingContent |
| `zodiac/` | `zo` | Origin Component | ajax infrastructure, secure, form engine |
| `zone/` | `zone` | Base Utility Zone | datetime, value, assort functions |
| `zoe@em/` | `zme` | Environment Model | DataObject, DataArray, DataContainer |
| `zither@em/` | `zmr` | Qr Model Engine | QQuery, HocI18r, criteria builder |
| `zest@web/` | `zs` | Subsystem Toolkit | TableEditor, TreeSelector, AddressSelector |
| `unfold/` | `zei` | Extension Interface | Rendering extensions |
| `upper/` | `zep` | Extension Processor | Processing extensions |
| `utter/` | `zet` | Extension Toolkit | Base extensions |

## Delegation Chain

```
Ux (ux/) ← aggregates: zero/, zion/, zodiac/, zone/, zest@web/
entity (entity@em/) ← aggregates: zoe@em/, zither@em/
```

## File Naming Convention

Pattern: `<layer>.<type>.<prefix>.<suffix>.js`

| Part | Values |
|------|--------|
| `layer` | Semantic module name |
| `type` | `fn` (functions), `v` (constants), `c` (class), `o` (higher-order) |
| `prefix` | Function name prefix |
| `suffix` | Feature semantic word |

Special: `__` prefix = private function, `_` prefix = private class, `UNLOCK` suffix = breaks circular dependencies
