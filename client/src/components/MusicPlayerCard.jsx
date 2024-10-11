import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function MusicPlayerCard({ trackIds }) {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
    spotifyApi.setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    debugger;
    getTrackInfo();
  }, [accessToken]);

  const getTrackInfo = async () => {
    try {
      await spotifyApi
        .getTracks(trackIds)
        .then(function (data) {
          console.log(data.body);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="bg-slate-400">
        <div className="flex flex-col justify-around">
          <div></div>
        </div>
      </div>
    </>
  );
}
