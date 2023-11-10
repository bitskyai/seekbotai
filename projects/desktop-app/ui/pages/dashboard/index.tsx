import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <Link to="/settings">Settings</Link>
    </div>
  );
}
