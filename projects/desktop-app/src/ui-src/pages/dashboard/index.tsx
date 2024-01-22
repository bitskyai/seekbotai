import { ipcRenderer } from "electron";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  useEffect(() => {
    ipcRenderer.on("message", (event, message) => {
      console.log("message", message);
    });
  }, []);
  return (
    <div>
      Dashboard
      <Link to="/settings">Settings</Link>
    </div>
  );
}
