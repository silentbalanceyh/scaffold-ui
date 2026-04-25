# Ux — Type Checking

> Source: `src/ux/interface.abyss.js`

| Function | Purpose |
|----------|---------|
| `isCn(lang)` | Check if language is Chinese |
| `isDateIso(value)` | Check ISO date format |
| `isBlank(value)` | Check blank/null/undefined |
| `isValid(value)` | Check valid (not null/undefined) |
| `isFileName(value)` | Check valid filename |
| `isNumber(value)` | Check number type |
| `isCurrency(value)` | Check currency format |
| `isDecimal(value)` | Check decimal number |
| `isRule(rule)` | Check valid validation rule |
| `isRuleAll(rule)` | Check rule with "all" mode |
| `isRuleAny(rule)` | Check rule with "any" mode |
| `isDiff(left, right)` | Check deep difference |
| `isSubset(sub, parent)` | Check subset relationship |
| `isEmpty(value)` | Check empty (array/object/string) |
| `isParent(parent, child)` | Check parent-child path |
| `isObject(value)` | Check plain object |
| `isRange(value, min, max)` | Check value in range |
| `isRangeIn(value, min, max)` | Check strictly in range |
| `isFunction(value)` | Check function type |
| `isArray(value)` | Check array type |
| `isSet(value)` | Check Set type |
| `isQr(value)` | Check QQuery object |
| `isCollection(value)` | Check collection type |
| `isBefore(date1, date2)` | Check date before |
| `isAfter(date1, date2)` | Check date after |
| `isNotEmpty(value)` | Check not empty |
| `isTEntity(value)` | Check typed entity |
| `isTObject(value)` | Check typed object |
| `isFunctionName(value)` | Check valid function name |
| `isSame(left, right)` | Check deep equality |
| `isMoment(value)` | Check moment/dayjs object |
| `isQrArg(value)` | Check QQuery argument |
| `isTimeSame(t1, t2)` | Check time equality |
