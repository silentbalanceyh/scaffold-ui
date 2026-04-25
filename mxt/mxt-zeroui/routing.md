# Routing — URL Convention & Page Structure

## URL Pattern

`/:app/:module/:page` — e.g. `/main/admin/user`

## Page Resolution

URL segments map to Container/Component files:

```
URL: /main/admin/user
  → Container: src/container/admin/user/UI.js
  → Component: src/components/admin/user/UI.js
```

## Container / Component Split

Every page has two files:

| File | Responsibility |
|------|----------------|
| `container/<module>/<page>/UI.js` | Layout, `@Ux.zero` HOC, data wiring |
| `components/<module>/<page>/UI.js` | Pure render, receives props from container |

## Container Template

```jsx
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI").loading("app")
    .connect(state => Ux.dataIn(state).revamp(["app"]).to())
    .to())
class UI extends React.PureComponent {
    render() { return (<Component {...this.props}/>) }
}
export default UI;
```

## Component Template

```jsx
class UI extends React.PureComponent {
    render() { return (<PageCard>...</PageCard>) }
}
export default UI;
```
