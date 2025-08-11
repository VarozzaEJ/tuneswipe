import React from "react";
import { Button } from "@/components/ui/button";
import AnimatedTitle from "../AnimatedTitle.jsx";
import Login from "../Login.jsx";
export default function SpotifyLogin() {
  return (
    <>
      <div className="container  flex flex-col justify-around items-center min-h-screen h-screen">
        <div>
          <h1>
            <AnimatedTitle text={"Tune Swipe"} />
          </h1>
        </div>
        <a
          href={`https://accounts.spotify.com/authorize?client_id=${
            import.meta.env.VITE_CLIENT_ID
          }&response_type=code&redirect_uri=https://darkgreen-dugong-950229.hostingersite.com/&scope=streaming%20user-read-email%20user-read-private%20user-top-read%20user-read-recently-played%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`}
        >
          <Button variant={"secondary"} size={"lg"}>
            Login To Spotify
          </Button>
        </a>
      </div>
    </>
  );
}
