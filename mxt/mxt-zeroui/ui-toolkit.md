# Ui — smartForm / smartList

> Source: `src/ui/ui.page.js`
> Import: `import Ui from 'ui';`

## Ui.smartForm(config, mode)

Compresses form page code to ~15% of normal size.

```js
Ui.smartForm({
    ns,                    // Cab.json namespace
    name,                  // Page name (for logging)
    Cab: {                 // Form config file names
        FormAdd: "UI.Add",
        FormEdit: "UI.Edit",
        FormFilter: "UI.Filter",
    },
    componentInit,         // componentDidMount injection
    componentUp,           // componentDidUpdate injection
    componentYo,           // render injection
    yoOp,                  // $op variable injection
    yoAcl,                 // ACL/edition control
    yoPlugins,             // Plugin injection
    yoJsx,                 // Custom JSX injection
    yoAmbient,             // Ambient data injection
    yoExecutor,            // Executor injection
    yoRenders,             // Custom renders
    yoRx,                  // Rx injection
    smartOp,               // Smart operation builder
}, mode)                   // ADD | EDIT
```

## Ui.smartList(config, mode)

```js
Ui.smartList({
    ns, name,
    Cab: { FormFilter: "UI.Filter" },
    componentInit, yoOp, yoAcl,
}, config)
```

## Internal Functions

| Function | Purpose |
|----------|---------|
| `rxEtat` | HOC builder wrapper |
| `cab` | Cab.json reader |
| `ready` | Ready state builder |
| `componentInit` | Init lifecycle |
| `componentUp` | Update lifecycle |
| `yoRender` | Render prop computation |
| `yoForm` | Form prop computation |
| `yoOp` | Operation variable builder |
| `smartOp` | Smart operation builder |
| `yoJsx` | JSX injection |
| `yoAcl` | ACL injection |
| `yoPlugins` | Plugin injection |
| `yoAmbient` | Ambient injection |
| `yoExecutor` | Executor injection |
| `yoRenders` | Render injection |
| `yoRx` | Rx injection |
| `renderAddOn` | Add-on renderer |
| `renderWrapper` | Wrapper renderer |
| `contentFn` | Content function builder |
