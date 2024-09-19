import React from "react";
import Dashboard from "../components/ui/Dashboard.jsx";
import Login from "../components/ui/Login.jsx";
export default function HomePage() {
  // const CLIENT_ID = "c4f463066209462aa6798856d58701d9";
  // const REDIRECT_URI = "http://localhost:8080";
  // const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  // const RESPONSE_TYPE = "token";

  const code = new URLSearchParams(window.location.search).get("code");
  return <>{code ? <Dashboard code={code} /> : <Login />}</>;
}
