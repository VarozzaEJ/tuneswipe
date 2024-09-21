import React from "react";
import { Button } from "@/components/ui/button";
export default function Login() {
  return (
    <>
      <div className="container  flex flex-col justify-around items-center min-h-screen h-screen">
        <div>
          <h1 className="text-3xl">Tune Swipe</h1>
        </div>
        {/* <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
        Login To Spotify
        </a> */}

        <a
          href={`https://accounts.spotify.com/authorize?client_id=${
            import.meta.env.VITE_CLIENT_ID
          }&response_type=code&redirect_uri=http://localhost:5173`}
        >
          <Button variant={"secondary"} size={"lg"}>
            Login To Spotify
          </Button>
        </a>
      </div>
    </>
  );
}
