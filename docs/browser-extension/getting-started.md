# Browser Extension


## FAQs
### Why `options`, `contents`, `tab` not direct send request, instead of using background as a delegation
1. To reduce the work of init `apolloClient`. In our case, if a user restart `bitsky` desktop app, to avoid `port` conflict, have a chance `port` is changed, so we need to re-init `apolloClient`. So to keep this work is simple, we only have `background` watch `port` change and re-init
2. To avoid request was cancelled because of close pages. Especial for the `options` it is a popup, if loose focus then it maybe cause request cancelled
3. Have one place to host same logic, easy to maintain and change


