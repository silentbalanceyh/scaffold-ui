# Ux — Navigation & Ambient

> Source: `src/ux/unity.interface.*.js`

| Function | Purpose |
|----------|---------|
| `toQuery(params)` | Object to query string |
| `toQueryKv(params)` | Object to key-value query |
| `toRoute(reference, route)` | Navigate to route |
| `toProtocol(reference)` | Get protocol info |
| `toUrl(reference)` | Get current URL |
| `isRoute(reference, path)` | Check current route |
| `isLoaded(reference)` | Check if component loaded |
| `toPid(reference)` | Get page ID |
| `isLogged(reference)` | Check if user logged in |
| `isInit(reference)` | Check if app initialized |
| `isAuthorized(reference)` | Check if authorized |
| `toLogout(reference)` | Logout and redirect |
| `toOriginal(reference)` | Reset to original state |
| `toPassword(reference)` | Navigate to password change |
| `toUnauthorized(reference)` | Navigate to unauthorized |
| `toLoading(reference, key)` | Set loading state |
| `toAssist(reference, key)` | Load assist data |
| `isMod(reference, key)` | Check module enabled |
| `toVis(reference, key)` | Toggle visibility |
| `devSkipValidate(reference)` | Skip validation in dev mode |
