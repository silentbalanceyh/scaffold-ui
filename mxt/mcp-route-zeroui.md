# MCP Route — Zero UI Frontend Framework

## 1. Activation

Activate when the request is about:

- zero-ui frontend page creation or modification
- React component development using Ux/Ex/Ei/Web/Oi APIs
- Form/list configuration (Cab.json, ExForm, ExListComplex, smartForm, smartList)
- Frontend API calls (ajaxGet, ajaxPost, Ex.I.*)
- i18n, ACL, routing, skin, new app scaffolding
- Any `import` from `ux`, `ex`, `ei`, `web`, `oi`, `ui`, `lang`, `skin`, `entity`
- Framework-internal dependency direction, reverse imports, or
  `zero.module.dependency.js`
- Framework source under `src/ux`, `src/ui`, `src/extension`, `src/economy`,
  `src/zero`, `src/zest@web`, `src/zion`, `src/zither@em`, `src/zodiac`,
  `src/zoe@em`, or `src/zone`

Regex: `(?i)\b(zero-ui|zeroui|scaffold-ui|@Ux\.zero|rxEtat|smartForm|smartList|ExForm|ExListComplex|Ex\.I\.|Ux\.ajax|Ux\.acl|Cab\.json|fromPath|PageCard|ExAdmin|OxForm|zero\.module\.dependency|reverse import|framework dependency|ai sync|frontend.*zero)\b`

## 2. Mandatory Reading Set

Always read narrowly. Do not bulk-load every file under `mxt-zeroui/`.

1. **`mxt-zeroui/index.md`** — Route table and task-specific doc selection
2. **`mxt-zeroui/architecture.md`** — Application-facing import boundary
3. **`mxt-zeroui/errors-pitfalls.md`** — Top AI mistakes to avoid
4. Task-specific doc from the route table

When the task modifies or diagnoses framework source, also read:

5. **`mxt-zeroui/module-dependency.md`** — Framework module order, reverse
   dependency rules, and `zero.module.dependency.js` gateway policy
6. **`mxt-zeroui/internal-modules.md`** — Internal modules for debug/graph
   navigation only

Additional: `frontend-client-integration.md`, `mxt-sync-rules.md`

## 3. Execution Contract

1. Read `mxt-zeroui/index.md` to find the right module doc
2. Read `mxt-zeroui/architecture.md` for the three-tier boundary
3. Decide whether the task is application usage or framework-source work
4. For application usage, never import from internal modules; use public
   surfaces such as `Ux`, `Ex`, `Ui`, `web`, `ei`, `oi`, `lang`, `skin`,
   `entity`
5. For framework-source work, follow `module-dependency.md` before changing
   imports or shared helpers
6. Follow Container/Component split for pages
7. Use Cab.json-driven configuration for forms and lists
8. Respect the three-tier architecture

## 4. Priority Rule

Beats: generic React/TS rules when zero-ui specific, `frontend-client-integration.md` for page/component creation.
Combines with: `mcp-route-zero-ecotope-handshake.md` for fullstack tasks.

When generic frontend guidance conflicts with zero-ui docs, zero-ui docs win.
When application-facing boundary docs appear to conflict with framework-source
dependency docs, use this split:

- Application code imports public SDK surfaces.
- Framework source follows the internal one-way module order in
  `module-dependency.md`.

## 5. New App Scaffolding

Full checklist: `mxt-zeroui/new-app-checklist.md`.

## 6. Do Not Do

- Do not import from `zone`, `zi`, `zo`, `zme`, `zmr`, `zs` — use `Ux`
- Do not use axios — native Fetch API only
- Do not create forms in JSX — use Cab.json + ExForm/smartForm
- Do not hardcode menus — backend-driven via `Ex.I.menus()`
- Do not skip i18n — always use `@Ux.zero` with `.cab()` and `Lg()`
- Do not import `Ex` from plugin code — circular dependency
- Do not forget `.to()` at the end of `Ux.rxEtat()` builder
- Do not add reverse framework dependencies to make a missing function visible
- Do not import `Ux` from `"ux"` inside `src/ux` or `src/ui`
- Do not import `Ex` from `"ex"` inside `src/extension` or `src/economy`
- Do not bypass `zero.module.dependency.js` for cross-module lower-layer
  framework capability when the module has that gateway

## 7. Reading Order

Application/page/config work:

```text
mxt-zeroui/index.md → mxt-zeroui/architecture.md → task-specific doc → Cab.json → component source → internals (debug only)
```

Framework-source work:

```text
mxt-zeroui/index.md → mxt-zeroui/architecture.md → mxt-zeroui/module-dependency.md → mxt-zeroui/internal-modules.md → task-specific source
```

## 8. MCP Evidence Policy

- Prefer this MCP route before searching broad repository source.
- Use `mxt-zeroui/index.md` as the dispatcher; only open the documents matched
  by the route table.
- Use source inspection to verify exact behavior after the route docs identify
  the correct module.
- For framework dependency questions, inspect `zero.module.dependency.js`
  files and import edges before proposing a fix.
- Do not copy application-local runtime patches into the framework without
  rechecking framework module direction.

## 9. Framework Dependency Quick Reference

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

Imports may move only downward in this list. If a lower module needs behavior
from an upper module, move orchestration upward, inject a callback, or return a
structured signal for upper code to handle.
