# Ei — Form & List Components

> Import: `import { ExForm, ExListComplex } from 'ei';`

## Form / List / Data

| Component | Key Props | Description |
|-----------|-----------|-------------|
| `ExForm` | `$inited`, `$mode`, `config`, `rxSubmit`, `rxClose` | Standard CRUD form |
| `ExListComplex` | `config`, `$query`, `rxSearch` | Complex list with search/pagination/actions |
| `ExListFast` | `config`, `$query` | Full-window operation list |
| `ExRecord` | `$inited`, `config` | Dynamic form record display |
| `ExTab` | `config`, `$activeKey` | Tab container |
| `ExArbor` | `$treeData`, `rxSelect` | Left tree with Collapse |
| `ExCategory` | `config` | Category tree management |
| `ExTabular` | `config` | Dictionary/tabular management |

## Login Variants

| Component | Description |
|-----------|-------------|
| `ExLogin` | Standard login (no captcha) |
| `ExLoginBuiltIn` | Login with captcha |
| `ExLoginWechat` | WeChat QR login |
| `ExLoginSms` | SMS code login |
| `ExLoginComplex` | 3-in-1 login (auto-select by config) |
| `ExSubmit` | Login with remember-me |
