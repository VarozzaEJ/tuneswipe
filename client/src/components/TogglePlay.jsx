import React from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk/src/device.tsx";
import { useSpotifyPlayer } from "react-spotify-web-playback-sdk/src/spotifyPlayer.tsx";
const SPOTIFY_URI = "spotify:track:7xGfFoTpQ2E7fRF5lN10tr";
export default function TogglePlay({ accessToken }) {
  const device = usePlayerDevice();

  const playCarlyRaeJepsen = () => {
    if (device === null) return;

    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
      {
        method: "PUT",
        body: JSON.stringify({ uris: [SPOTIFY_URI] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  if (device === null) return null;

  return <button onClick={playCarlyRaeJepsen}>Play Carly Rae Jepsen</button>;
}
