# New App Checklist (ai sync)

> When `ai sync` installs zero-ui to a new application directory.

## Prerequisites

- zero-ui framework source accessible via `$MXT_ZERO/zero-ui/`
- Backend API server running (for `Z_ENDPOINT`)
- `mo-mcp` available in `$R2MO_HOME/bin/`

## Steps

1. **Clone/copy** zero-ui to the new project directory
2. **Update `package.json`** name field to new app name
3. **Set environment variables** in `.env.development`: `Z_APP`, `Z_ENDPOINT`, `Z_K_SESSION`, `Z_LANGUAGE`
4. **Create page containers**: `src/container/<module>/<page>/UI.js`
5. **Create page components**: `src/components/<module>/<page>/UI.js`
6. **Create i18n resources**: `cab/cn/components/<module>/<page>/UI.json`
7. **Create form configs**: `UI.Add.json`, `UI.Edit.json`, `UI.Filter.json`
8. **Add $op handlers** in `Op.js` files alongside each component
9. **Register custom epics/actions** in `src/app/action/` if needed
10. **Run `mo-mcp`** in the new project to register framework MCP servers

## What NOT to Modify

`zero/`, `zion/`, `zodiac/`, `zone/`, `zoe@em/`, `zither@em/`, `zest@web/`, `ux/`, `extension/`, `economy/`, `ui/`, `environment/`, `skin/`

## What You CAN Modify

`app/`, `container/`, `components/`, `cab/`, `app@mock/`, `app@plugin/`, `style/`, `skin/` (overrides), `.env.*`
