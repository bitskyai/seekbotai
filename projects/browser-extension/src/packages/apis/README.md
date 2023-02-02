# APIs package

`APIs` package are used to wrap APIs used by `content script`, `popup`, `options` and `tab` to get informations. Current it is using `sendToBackground` of `@plasmohq/messaging` to send message to `background` script, and `background` script check local `RxDB` and retrun data.
The `APIs` wrap is forward compatible, when switch to cloud version, just need to re-implement `APIs` layer
