import * as React from "react";
import { Provider } from "react-redux";

import { ThemeProvider } from "~packages/antd-theme";
import { store } from "~packages/helpers/store";

import App from "./App";

function Popup() {
  return (
    <ThemeProvider>
      <React.StrictMode>
        <Provider store={store}>
          <App />
          {/* <div>Test .... </div> */}
        </Provider>
      </React.StrictMode>
    </ThemeProvider>
  );
}

export default Popup;
