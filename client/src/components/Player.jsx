import { mdiPlay, mdiReplay, mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import TogglePlay from "./TogglePlay.jsx";

const Playback = ({ accessToken, trackUri }) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const getOAuthToken = useCallback((callback) => callback(accessToken), []);

  const getAvailableDevices = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/devices",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Available devices:", data.devices);
      return data.devices;
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const transferPlayback = async (deviceId) => {
    if (!accessToken) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [deviceId] }),
      });

      if (response.ok) {
        console.log(`Playback transferred to device ID: ${deviceId}`);
      } else {
        console.error("Error transferring playback:", response.status);
      }
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  };

  const addSongToQueue = async () => {
    console.log(trackUri);
    if (!accessToken || !trackUri) return;

    try {
      debugger;
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=` + trackUri,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log(
          `successfully added the song with the uri of ${trackUri} to your queue`
        );
      } else {
        console.error("Error adding song to queue", response.status);
      }
    } catch (error) {
      console.error("Error adding song to queue", error);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
    getAvailableDevices();

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Working SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        // setTrack(state.track_window.current_track);
        // setPaused(state.paused);
      });
      player.getCurrentState().then((state) => {
        !state ? setIsReady(false) : setIsReady(true);
        console.log("🌞", state);
      });

      setPlayer(player);
      player.connect();
      //TODO call the get devices function in a higher component using a form, then, using the response from the api with all of the devices, save the id that the user chooses, send that down to this component, and interpolate that id in the line below.
      //TODO When a user goes to the next song, I should simultaneously send the next song in the tracks array to the queue, and then skip the song. I might have to do some weird fannagling to get the timing right, but I think it will work.
      transferPlayback("47775e88f5ecfb27b129faab422a73f0247aa7be");
      addSongToQueue();
    };
  }, [accessToken, trackUri]);

  const play = (uri) => {
    if (!isReady || !player || !accessToken) return;
    player
      .resume()
      .then(() => {
        player.togglePlay({
          uris: [uri],
        });
      })
      .then(() => {
        console.log("Playing track:", uri);
      })
      .catch((error) => {
        console.error("Error playing track:", error);
      });
  };

  const pause = () => {
    if (player) {
      player.pause();
    }
  };

  return (
    <div className="flex items-center justify-center">
      {player && isReady ? (
        <>
          <div
            role="button"
            className="hover:bg-slate-600 rounded-full me-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon size={1} path={mdiReplay} color="white" />
          </div>
          <div
            // onClick={() => play(`${trackUri}`)}
            onClick={() => pause()}
            role="button"
            className="hover:bg-purple-500 rounded-full bg-purple-400 w-16 h-16 flex items-center justify-center"
          >
            <Icon path={mdiPlay} color="white" size={1.8} />
          </div>
          <div
            role="button"
            className="hover:bg-slate-600 rounded-full ms-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon path={mdiSync} size={1} color="white" />
          </div>
          Example:{" "}
          <button onClick={() => play("spotify:track:TRACK_ID")}>Play</button>
        </>
      ) : null}
    </div>
  );
};

export default Playback;
