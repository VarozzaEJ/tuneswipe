import React from "react";
import Dashboard from "../components/ui/Dashboard.jsx";
import Login from "../components/ui/Login.jsx";
export default function HomePage() {
  const code = new URLSearchParams(window.location.search).get("code");
  return <>{code ? <Dashboard code={code} /> : <Login />}</>;
}
