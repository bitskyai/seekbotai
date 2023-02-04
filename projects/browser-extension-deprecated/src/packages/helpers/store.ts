import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { localStorage } from "redux-persist-webextension-storage";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  RESYNC,
  persistReducer,
  persistStore
} from "@plasmohq/redux-persist";
import { Storage } from "@plasmohq/storage";

import bookmarkSlice from "~packages/features/bookmark/bookmark.slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: localStorage
};

const persistedReducer = persistReducer(persistConfig, bookmarkSlice);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          RESYNC
        ]
      }
    })
});

export const persistor = persistStore(store);

// This is what makes Redux sync properly with multiple pages
// Open your extension's options page and popup to see it in action
new Storage().watch({
  [`persist:${persistConfig.key}`]: () => {
    persistor.resync();
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
