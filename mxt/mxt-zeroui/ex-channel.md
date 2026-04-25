# Ex — Channel Lifecycle

> Source: `src/extension/library/entry.channel.js`

## yi — componentDidMount

| Function | Purpose |
|----------|---------|
| `yiStandard(reference)` | Standard init: app config + menus |
| `yiCompany(reference)` | Init with company data |
| `yiPartForm(reference)` | Init partial form |
| `yiAssist(reference, key)` | Init assist data |
| `yiModule(reference, key)` | Init module config |

## yo — Render-time Prop Computation

| Function | Purpose |
|----------|---------|
| `yoRender(reference)` | Compute render props |
| `yoComponent(reference)` | Compute component props |
| `yoAmbient(reference)` | Compute ambient data |
| `yoForm(reference)` | Compute form props |
| `yoPage(reference)` | Compute page props |

## yl — Loading / Data Preparation

| Function | Purpose |
|----------|---------|
| `ylCard(reference, key)` | Card loading |
| `ylList(reference, key)` | List loading |
| `ylForm(reference, key)` | Form loading |

## yu — componentDidUpdate

| Function | Purpose |
|----------|---------|
| `yuReload(reference, key)` | Reload on update |
| `yuPage(reference, key)` | Page update |

## xui — UI Utilities

| Function | Purpose |
|----------|---------|
| `xuiDialog(reference, key)` | Dialog UI utility |
| `xuiColumn(reference, key)` | Column UI utility |
