# Ux — Callback & Message

> Source: `src/ux/interface.ajax.js`

## Message Notifications

| Function | Purpose |
|----------|---------|
| `messageSuccess(text)` | AntD success notification |
| `messageFailure(text)` | AntD error notification |
| `messageCatch(error)` | AntD error from exception |
| `messageConfirm(content, onOk)` | AntD confirm dialog |

## Ajax Response Handlers

| Function | Purpose |
|----------|---------|
| `ajaxError(error, reference)` | Standardized error handler |
| `ajaxReject(reference, error)` | Reject promise with logging |
| `ajax2Dialog(reference, data, key)` | Ajax response → dialog |
| `ajaxDialog(reference, data, key)` | Ajax response → dialog (legacy) |
| `ajax2Message(reference, data, key)` | Ajax response → message |
| `ajaxMessage(reference, data, key)` | Ajax response → message (legacy) |
| `ajax2True(reference, data, key)` | Ajax response → boolean check |
| `ajaxEager(reference, data)` | Eager response processing |
