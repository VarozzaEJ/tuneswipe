import React, { useEffect } from "react";
import Dashboard from "../components/ui/Dashboard.jsx";
import SpotifyLogin from "../components/ui/SpotifyLogin.jsx";
import Login from "../components/Login.jsx";
import axios from "axios";
export default function HomePage() {
  const code = new URLSearchParams(window.location.search).get("code");

  const soundLenssLogin = async () => {
    const response = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=slipknot&track=psychosocial&api_key=${
        import.meta.env.VITE_LASTFM_API_KEY
      }&limit=20&format=json`
    );
    console.log(response.data);
  };

  useEffect(() => {
    // soundLenssLogin();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessCode"))
      localStorage.removeItem("accessCode");

    if (!code) return;
    localStorage.setItem("accessCode", code);
  }, [code]);

  return <>{code ? <Dashboard code={code} /> : <SpotifyLogin />}</>;
}
