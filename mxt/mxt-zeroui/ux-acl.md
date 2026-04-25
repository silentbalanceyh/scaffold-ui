# Ux — ACL & Encryption

> Source: `src/ux/unity.interface.secure.js`

## ACL

| Function | Purpose |
|----------|---------|
| `aclOp(options, ops)` | ACL check for operations (button visibility) |
| `aclData($inited, reference, $edition)` | ACL check for data (field editability) |
| `aclSubmit(params, reference)` | ACL check before form submission |

## Digital Signature

| Function | Purpose |
|----------|---------|
| `digitToken()` | Get current JWT token |
| `digitSign(uri, method, params)` | Generate RESTful digital signature |

## Encryption

| Function | Purpose |
|----------|---------|
| `encryptMD5(value)` | MD5 hash |
| `encryptBase64(value)` | Base64 encode |
| `decryptBase64(value)` | Base64 decode |
| `encryptHmac512(value, key)` | HMAC-SHA512 |
| `encryptAES(value, key)` | AES encrypt |
