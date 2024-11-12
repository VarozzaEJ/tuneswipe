import { mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function TrackImageInPost({ img, trackURI, trackNumber }) {
  const [accessToken, setAccessToken] = useState("");
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
    await spotifyApi.setShuffle(false);
    const offset = trackNumber - 1;
    await spotifyApi.play({
      context_uri: `${trackURI}`,
      offset: {
        position: offset,
      },
    });
  };

  return (
    <div
      className="cursor-pointer showhim "
      onTouchStartCapture={() => {
        playSong();
      }}
      onClickCapture={() => {
        playSong();
      }}
    >
      <Icon
        className="absolute showme left-[50%] top-[50%] flex justify-center items-center transition-all ease-in-out  translate-x-[-50%] translate-y-[-50%]   w-20 h-20 z-50"
        path={mdiPlay}
        color="white"
        size={3}
      />
      <div>
        <img
          draggable="false"
          src={img}
          className="w-full max-w-[225px] md:max-w-[300px] rounded-sm"
          alt=""
        />
      </div>
    </div>
  );
}
