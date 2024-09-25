import { mdiPause, mdiPlay, mdiReplay, mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

const Playback = ({ accessToken, chosenDeviceId, recommendedTracks }) => {
  const [isReady, setIsReady] = useState(false);
  const [play, setPlay] = useState(false);

  console.log(recommendedTracks);
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const transferPlayback = async () => {
    if (!accessToken || !chosenDeviceId) return;
    const deviceId = `${chosenDeviceId}`;
    try {
      //NOTE If the chosenDeviceId is what the player is already set to, you will get an error. Figure out a way to stop this function from calling if you're chosen device is already what spotify is playing through.
      const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [deviceId] }),
      });

      if (response.ok) {
        console.log(`Playback transferred to device ID: ${chosenDeviceId}`);
      } else {
        console.error("Error transferring playback:", response);
      }
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  };

  const extractedAddSongToQueue = () => {
    recommendedTracks.forEach((track) => {
      addSongToQueue(track.uri);
    });
  };

  const addSongToQueue = async (trackUri) => {
    if (!accessToken || recommendedTracks.length == 0) return;
    try {
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

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (!accessToken || !chosenDeviceId || !recommendedTracks) return;
    const runRequiredFunctions = async () => {
      // const script = document.createElement("script");
      // script.src = "https://sdk.scdn.co/spotify-player.js";
      // script.async = true;

      // document.body.appendChild(script);

      // window.onSpotifyWebPlaybackSDKReady = () => {
      //   const player = new window.Spotify.Player({
      //     name: "Working SDK",
      //     getOAuthToken: (cb) => {
      //       cb(accessToken);
      //     },
      //     volume: 0.5,
      //   });

      //   player.addListener("ready", ({ device_id }) => {
      //     console.log("Ready with Device ID", device_id);
      //   });

      //   player.addListener("not_ready", ({ device_id }) => {
      //     console.log("Device ID has gone offline", device_id);
      //   });

      //   player.addListener("player_state_changed", (state) => {
      //     if (!state) {
      //       return;
      //     }

      //     // setTrack(state.track_window.current_track);
      //     // setPaused(state.paused);
      //   });

      //   setPlayer(player);
      //   player.connect()
      //TODO When a user goes to the next song, I should simultaneously send the next song in the tracks array to the queue, and then skip the song. I might have to do some weird fannagling to get the timing right, but I think it will work.
      //TODO UPDATE: Spotify API does not accept more than one call per few seconds, so this will turn out to be a big problem. Maybe, I set an interval and call the addSongToQueue() function after the interval with each URI gotten from the GetRecommendations() function in the ListenPage
      await transferPlayback();
      await extractedAddSongToQueue();
      playSong();
      sleep(8000);
      await skipToNext();
      setIsReady(true);
    };
    runRequiredFunctions();
  }, [recommendedTracks, accessToken, chosenDeviceId]);

  const skipToNext = async () => {
    await spotifyApi.skipToNext().then(
      function () {
        sleep(2000);
        console.log("Skip to next");
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  const playSong = () => {
    spotifyApi.play().then(
      function () {
        console.log("Playback started");
        setPlay(true);
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  const pause = () => {
    spotifyApi.pause().then(
      function () {
        console.log("Playback paused");
        setPlay(false);
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  const previous = () => {
    spotifyApi.skipToPrevious().then(
      function () {
        console.log("Skip to previous");
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  return (
    <div className="flex items-center justify-center">
      {isReady ? (
        <>
          <div
            role="button"
            title="Previous"
            onClick={() => previous()}
            className="hover:bg-slate-600 rounded-full me-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon size={1} path={mdiReplay} color="white" />
          </div>
          {play ? (
            <div
              title="Pause"
              // onClick={() => play(`${trackUri}`)}
              onClick={() => pause()}
              role="button"
              className="hover:bg-purple-500 rounded-full bg-purple-400 w-16 h-16 flex items-center justify-center"
            >
              <Icon path={mdiPause} color="white" size={1.8} />
            </div>
          ) : (
            <div
              // onClick={() => play(`${trackUri}`)}
              onClick={() => playSong()}
              title="Play"
              role="button"
              className="hover:bg-purple-500 rounded-full bg-purple-400 w-16 h-16 flex items-center justify-center"
            >
              <Icon path={mdiPlay} color="white" size={1.8} />
            </div>
          )}
          <div
            role="button"
            title="replay"
            className="hover:bg-slate-600 rounded-full ms-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon path={mdiSync} size={1} color="white" />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Playback;
