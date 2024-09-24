import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";
export default function PreBuiltPlayer({ accessToken, trackUri }) {
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      uris={trackUri ? [trackUri] : []}
      hideCoverArt
      styles={{
        sliderColor: "#A020F0",
        activeColor: "#A020F0",
        bgColor: "#334155",
      }}
    />
  );
}
