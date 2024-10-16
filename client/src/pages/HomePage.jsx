import React, { useEffect } from "react";
import Dashboard from "../components/ui/Dashboard.jsx";
import SpotifyLogin from "../components/ui/SpotifyLogin.jsx";
import Login from "../components/Login.jsx";
export default function HomePage() {
  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (localStorage.getItem("accessCode"))
      localStorage.removeItem("accessCode");

    if (!code) return;
    localStorage.setItem("accessCode", code);
  }, [code]);

  return <>{code ? <Dashboard code={code} /> : <SpotifyLogin />}</>;
}
