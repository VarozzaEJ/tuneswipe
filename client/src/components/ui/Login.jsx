import React from "react";
import { Button } from "@/components/ui/button";
import AnimatedTitle from "../AnimatedTitle.jsx";
export default function Login() {
  return (
    <>
      <div className="container  flex flex-col justify-around items-center min-h-screen h-screen">
        <div>
          <h1>
            <AnimatedTitle text={"Tune Swipe"} />
          </h1>
        </div>
        {/* <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
        Login To Spotify
        </a> */}

        <a
          href={`https://accounts.spotify.com/authorize?client_id=${
            import.meta.env.VITE_CLIENT_ID
          }&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`}
        >
          <Button variant={"secondary"} size={"lg"}>
            Login To Spotify
          </Button>
        </a>
      </div>
    </>
  );
}
