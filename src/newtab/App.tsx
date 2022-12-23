import React from "react";

function App() {
  return (
    <div>
      {chrome.i18n.getMessage("extensionName")} aaa Bookmark Intelligence new
      tab
      <h2>{chrome.i18n.getMessage("extensionName")}</h2>
    </div>
  );
}

export default App;
