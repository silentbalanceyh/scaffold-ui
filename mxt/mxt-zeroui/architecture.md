# Architecture — Three-Tier Import Boundary

## Three Tiers

| Tier | Editable? | Example |
|------|-----------|---------|
| **Application** | YES | `app/`, `container/`, `components/`, `cab/`, `app@plugin/` |
| **External (SDK)** | NO — import only | `ux`, `ex`, `ei`, `web`, `oi`, `ui`, `lang`, `skin`, `entity` |
| **Internal** | FORBIDDEN | `zero/`, `zion/`, `zodiac/`, `zone/`, `zoe@em/`, `zither@em/`, `zest@web/` |

This page describes the application-facing import boundary. Framework-internal
module order and reverse dependency rules are maintained in
`module-dependency.md`.

## Complete Alias Map

### Application Tier (developer edits)

| Alias | Directory | English |
|-------|-----------|---------|
| `app` | `src/app/` | Business code, epics, types |
| `app@plugin` | `src/app@plugin/` | Plugin code |
| `app@mock` | `src/app@mock/` | Mock data |
| `container` | `src/container/` | Page layout containers |
| `components` | `src/components/` | Page components |
| `cab` | `src/cab/` | i18n JSON resources |
| `style` | `src/style/` | Custom SCSS |

### External Tier (SDK surface — import only)

| Alias | Directory | English |
|-------|-----------|---------|
| `ux` | `src/ux/` | Framework API surface (Ux) |
| `ex` | `src/extension/` | Ex/Ei library |
| `ei` | `src/extension/ecosystem/` | Business UI components |
| `web` | `src/economy/` | Standard interactive components |
| `oi` | `src/extension/ox/` | Config-driven components |
| `ui` | `src/ui/` | smartForm/smartList |
| `lang` | `src/zither@em/` | i18n engine (Lg, fromPath) |
| `skin` | `src/skin/` | Theme system (Sk.mix) |
| `entity` | `src/entity@em/` | Dsl, DataObject, DataArray |

### Internal Tier (FORBIDDEN — debug/graph only)

| Alias | Directory | English |
|-------|-----------|---------|
| `zero` | `src/zero/` | @Ux.zero decorator |
| `zion` | `src/zion/` | Interact-Oriented Native (@uca) |
| `zodiac` | `src/zodiac/` | Origin Component (ajax, secure, form engine) |
| `zone` | `src/zone/` | Base Utility Zone |
| `zme` | `src/zoe@em/` | Environment Model (DataObject etc.) |
| `zmr` | `src/zither@em/` | Qr Model Engine (QQuery) |
| `zs` | `src/zest@web/` | Subsystem Toolkit |

## Delegation Chain

```
Ux (ux/) ← aggregates: zero/, zion/, zodiac/, zone/, zest@web/
entity (entity@em/) ← aggregates: zoe@em/, zither@em/
```

Do not read this aggregate chain as permission for lower modules to import
upper modules. Inside framework source, follow the one-way dependency order in
`module-dependency.md` and route lower-layer access through
`zero.module.dependency.js` where the module provides one.
