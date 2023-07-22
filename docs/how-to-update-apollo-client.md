# How to create or update Apollo Client

During browser extension init, it has following steps:

1. Check Service Health
   - Not pass health check. Then need to start service discovery
   - During service discovery apollo client create should hold on
   - If service discovery failed, then need to indicate user cannot find service, ask user to check whether service is running. Process end
2. Find service, then create apollo client

All the change of `uri` are through [Plasmo Watch(for state sync)](https://docs.plasmo.com/framework/storage#watch-for-state-sync), so where you try to get apollo client, you also need to do following:

```javascript
storage.watch({});
```
