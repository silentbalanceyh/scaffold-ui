# Ux — Value & Type Converters

> Source: `src/ux/interface.element.js`

## Value Converters

| Function | Purpose |
|----------|---------|
| `valueArray(value)` | Ensure array type |
| `valuePinyin(text)` | Convert to pinyin |
| `valueAppend(obj, key, value)` | Append to object key |
| `valueValid(value)` | Return valid or default |
| `valuePath(path, obj)` | Read nested path |
| `valueDatetime(date)` | Format datetime |
| `valueJDatetime(date)` | Format JSON datetime |
| `valueDuration(ms)` | Format duration |
| `valueEndTime(date)` | End of day |
| `valueStartTime(date)` | Start of day |
| `valueNow()` | Current datetime |
| `valueInt(value)` | Parse integer |
| `valueFloat(value)` | Parse float |
| `valueBoolean(value)` | Parse boolean |
| `valueFactor(value)` | Factor calculation |
| `valuePair(key, value)` | Create key-value pair |
| `valueLimit(value, min, max)` | Clamp value |
| `valueCopy(source)` | Shallow copy |
| `valueOk(value)` | Truthy check |
| `valueLink(text, href)` | Create link |
| `valueLadder(value, steps)` | Ladder/stepped value |
| `valueParse(expr)` | Parse expression |
| `valueT(value)` | T-type conversion |
| `valueSTDN(value)` | STDN format conversion |

## Type Converters

| Function | Purpose |
|----------|---------|
| `toJson(data)` | Convert to JSON string |
| `toColor(value)` | Convert to color |
| `toTime(value)` | Convert to time |
| `toKV(obj)` | Object to key-value pairs |
| `toArray(value)` | Ensure array |
| `toUri(params)` | Object to URI query string |
| `fromPath(reference, ...path)` | Read from i18n/resource path |
