import { mdiPause, mdiPlay, mdiReplay, mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

const Playback = ({
  accessToken,
  chosenDeviceId,
  recommendedTracks,
  likeSongIndex,
  isOnRightSong,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    if (!chosenDeviceId) return;
    transferPlayback();
  }, [accessToken, chosenDeviceId]);

  const transferPlayback = async () => {
    await spotifyApi.transferMyPlayback([`${chosenDeviceId}`]).then(
      function () {
        console.log("Transfering playback to " + chosenDeviceId);
      },
      function (err) {
        console.log(chosenDeviceId);
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
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
        console.log();
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
    if (
      !accessToken ||
      !chosenDeviceId ||
      recommendedTracks.length !== 20 ||
      !isOnRightSong
    )
      return;
    const runRequiredFunctions = async () => {
      if (sessionStorage.getItem("supports_volume") == "true") {
        spotifyApi.setVolume(75);
      }
      await addSongToQueue(recommendedTracks[0].uri);
      playSong();
      setPlay(true);
      await skipToNext();
      await addSongToQueue(recommendedTracks[1].uri);
      await addSongToQueue(recommendedTracks[2].uri);
      setIsReady(true);
    };
    runRequiredFunctions();
  }, [recommendedTracks, accessToken, isOnRightSong, chosenDeviceId]);

  const skipToNext = async () => {
    await spotifyApi.skipToNext().then(
      function () {
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

  const replay = async () => {
    if (sessionStorage.getItem("supports_volume") == "true") {
      await spotifyApi.setVolume(0);
    }
    await spotifyApi
      .addToQueue(`${recommendedTracks[likeSongIndex].uri}`)
      .then(function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      });
    if (likeSongIndex !== 0) {
      await skipToNext();
      await skipToNext();
    } else {
      await skipToNext();
      await skipToNext();
      await skipToNext();
    }
    await spotifyApi.addToQueue(`${recommendedTracks[likeSongIndex + 1].uri}`);
    if (likeSongIndex == 0) {
      await spotifyApi.addToQueue(
        `${recommendedTracks[likeSongIndex + 2].uri}`
      );
    }
    if (sessionStorage.getItem("supports_volume") == "true") {
      await spotifyApi.setVolume(75);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <>
        <div className="flex flex-col items-center me-4">
          <div
            role="button"
            title="Previous"
            onClick={() => replay()}
            className="hover:bg-slate-600 delay-75 transition-all ease-in-out rounded-full  bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon size={1} path={mdiReplay} color="white" />
          </div>
          <span className="text-slate-400">Replay</span>
        </div>
        {play ? (
          <div
            title="Pause"
            // onClick={() => play(`${trackUri}`)}
            onClick={() => pause()}
            role="button"
            className="hover:bg-purple-500 delay-75 transition-all ease-in-out rounded-full bg-purple-400  mb-5 w-16 h-16 flex items-center justify-center"
          >
            <Icon path={mdiPause} color="white" size={1.8} />
          </div>
        ) : (
          <div
            // onClick={() => play(`${trackUri}`)}
            onClick={() => playSong()}
            title="Play"
            role="button"
            className="hover:bg-purple-500 delay-75 transition-all ease-in-out rounded-full bg-purple-400 mb-5 w-16 h-16 flex items-center justify-center"
          >
            <Icon path={mdiPlay} color="white" size={1.8} />
          </div>
        )}
      </>
    </div>
  );
};

export default Playback;
