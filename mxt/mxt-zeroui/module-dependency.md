# Framework Module Dependency

> Framework-only rule. This document describes dependency direction inside the
> zero-ui source tree. It must not contain application-specific findings.

## Canonical Order

zero-ui framework modules depend from upper/public layers to lower/base layers:

```text
extension / economy
  -> unfold
  -> upper
  -> utils
  -> utter
  -> ux / ui
  -> zero
  -> zest@web
  -> zion
  -> zither@em
  -> zodiac
  -> zoe@em
  -> zone
```

The direction is one-way:

- A module may import itself or a module below it in this order.
- A module must not import a module above it in this order.
- `ux` and `ui` are the same base public layer.
- `extension` and `economy` are the upper extension/component layer.

## Alias Layer Map

| Layer | Directories / aliases | Responsibility |
|---|---|---|
| Extension/component | `extension` (`ex`, `ei`, `oi`), `economy` (`web`) | Business-oriented extension APIs and reusable business components |
| Extension bridge | `unfold` (`zei`) | Extension interface bridge |
| Extension processor | `upper` (`zep`) | Extension processor utilities |
| Utility extension | `utils`, `utter` (`zet`) | Extension toolkit and helpers |
| Public base surface | `ux`, `ui` | Public base API and smart UI surface |
| Runtime aggregation | `zero` | Decorator/HOC/runtime public aggregation |
| Web subsystem | `zest@web` (`zs`) | Low-level web subsystem toolkit |
| Native interaction | `zion` (`zi`) | Interaction primitives, dialogs, loading wrappers |
| Query/i18n model | `zither@em` (`zmr`, `lang`) | Query, i18n, criteria model |
| Origin runtime | `zodiac` (`zo`) | Ajax, secure, store, form runtime infrastructure |
| Environment model | `zoe@em` (`zme`) | DataObject, DataArray, environment model |
| Base utility | `zone` | Pure base utilities |

## Gateway Rule

Inside a framework module, cross-module access to lower-layer capability must go
through that module's `zero.module.dependency.js`.

Feature files should import the local gateway:

```js
import __Zn from "./zero.module.dependency";
```

The gateway may aggregate only same-layer or lower-layer modules according to
the canonical order. Do not scatter direct lower-layer imports through feature
files when the module already has a gateway.

Existing framework gateways:

```text
unfold/zero.module.dependency.js
upper/zero.module.dependency.js
zero/zero.module.dependency.js
zest@web/zero.module.dependency.js
zion/zero.module.dependency.js
zodiac/zero.module.dependency.js
```

## Forbidden Reverse Dependencies

Never fix a missing function by importing an upper module from a lower module.

Forbidden examples:

```js
// zodiac is lower than zion.
import Zi from "zi";

// zone is the base layer and must not import ux/ui/extension/economy.
import Ux from "ux";
```

If lower code appears to need upper behavior, move orchestration to the first
upper caller that owns both concerns, inject a callback/configuration, or return
a structured signal for upper code to handle.

## Forbidden Self-Aggregate Imports

### `ux` / `ui`

Files under `src/ux` and `src/ui` must not import the public aggregate alias:

```js
import Ux from "ux";
```

Reason: `ux` is the public aggregate of the layer. Importing it from inside the
same layer creates circular initialization risk and hides the true dependency.

Use local files, the module gateway, or a lower-layer module instead.

### `extension` / `economy`

Files under `src/extension` and `src/economy` must not import the public
aggregate alias:

```js
import Ex from "ex";
```

Reason: `ex` is the public aggregate of the extension/component layer. Shared
extension behavior belongs in local internal files or a lower framework module,
not behind the public aggregate.

## Unauthorized / Routing Boundary

Lower runtime modules such as `zodiac` may detect transport status such as
`401`, but must not import routing or page behavior from `zion`, `ux`, `ui`,
`extension`, or `economy`.

Correct patterns:

- Handle routing in an upper layer that already owns application/router state.
- Inject an unauthorized callback into lower Ajax/runtime infrastructure.
- Return a structured unauthorized signal and let upper code decide navigation.

Incorrect pattern:

```js
// Forbidden: lower runtime pulls upper routing capability.
// src/zodiac/zero.module.dependency.js
import Zi from "zi";
```

## Review Checklist

- Does the changed file import only same-layer or lower-layer framework modules?
- Does cross-module lower-layer access go through `zero.module.dependency.js`
  where the module has a gateway?
- Does any `src/ux` or `src/ui` file import `Ux` from `"ux"`?
- Does any `src/extension` or `src/economy` file import `Ex` from `"ex"`?
- Does the fix add an upper import to make one lower-layer function available?
