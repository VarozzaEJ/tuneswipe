import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function TrackImageInPost({ img, trackURI }) {
  const [accessToken, setAccessToken] = useState("");
  console.log(trackURI);

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const playSong = async () => {
    if (!accessToken) return;
    await spotifyApi.play({ context_uri: `${trackURI}` });
  };

  return (
    <div
      className="cursor-pointer"
      onTouchStartCapture={() => {
        playSong();
      }}
      onClickCapture={() => {
        playSong();
      }}
    >
      <img
        src={img}
        className="w-full max-w-[225px] md:max-w-[300px] rounded-sm"
        alt=""
      />
    </div>
  );
}
