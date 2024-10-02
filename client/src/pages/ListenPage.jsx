import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "../services/useAuth.js";
import { useNavigate } from "react-router-dom";
import TrackCard from "../components/ui/TrackCard.jsx";
import { mdiPlay, mdiReplay, mdiRewind, mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import Player from "../components/Player.jsx";
import axios from "axios";
import PreBuiltPlayer from "../components/PreBuiltPlayer.jsx";
import TinderCard from "react-tinder-card";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function ListenPage() {
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(2);
  const [likeSongIndex, setLikeSongIndex] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [chosenDeviceId, setChosenDeviceId] = useState("");
  const [artistIds, setArtistIds] = useState([]);
  const searchParams = useParams();
  //NOTE this grabbing an array that could not exist possibly could mess things up
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [lastSwipedURI, setLastSwipedURI] = useState("");
  const [isReady, setIsReady] = useState(false);

  console.log("🎤", lastSwipedURI);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(recommendations.length)
        .fill(0)
        .map((i) => React.createRef()),
    [recommendations]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < recommendations.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = async (direction, songURI, index) => {
    setLastDirection(direction);
    setCurrentSongIndex(currentSongIndex + 1);
    setLikeSongIndex(likeSongIndex + 1);
    if (direction == "left") {
      await skipToNext();
    }
    if (direction == "right") {
      await addSongToYourMusic(recommendedTracks[likeSongIndex - 2].id);
      await skipToNext();
    }
    if (currentIndex > 1) {
      addSongToQueue(recommendations[currentIndex - 2].uri);
    }
    updateCurrentIndex(index - 1);
    setLastSwipedURI(songURI);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < recommendations.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
    await addSongToQueue(lastSwipedURI);
    await skipToNext();
    await skipToNext();
    await addSongToQueue(recommendations[currentIndex].uri);
  };

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

  const addSongToYourMusic = async (songId) => {
    try {
      spotifyApi.addToMySavedTracks([`${songId}`]).then(
        function (data) {
          console.log("Added track!");
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
    setIds();
    setDeviceId();
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken.length == 0) return;

    spotifyApi
      .getRecommendations({
        min_energy: 0.4,
        //NOTE length of this array can only be <10 artists?
        seed_artists: artistIds,
        min_popularity: 50,
      })
      .then(
        function (data) {
          let recommendations = data.body;
          const flippedArray = [...data.body.tracks].reverse();
          console.log("👺", recommendations);
          console.log("🧍‍♂️", flippedArray);
          setRecommendations(data.body.tracks);
          setRecommendedTracks(flippedArray);
          setCurrentIndex(data.body.tracks.length - 1);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    setIsReady(true);
  }, [artistIds, accessToken]);

  function setIds() {
    const ids = searchParams.artistIds
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setArtistIds(ids);
  }

  function setDeviceId() {
    const deviceId = searchParams.deviceId;
    setChosenDeviceId(deviceId);
  }

  return (
    <>
      <div className="container overflow-y-hidden h-screen  flex-col flex justify-center">
        <div className="h-3/4 flex items-center justify-center">
          {recommendations &&
            recommendations.map((track, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="absolute w-[350px] h-[375px]"
                key={track.name}
                flickOnSwipe
                preventSwipe={["down", "up"]}
                onSwipe={(dir) => swiped(dir, track.uri, index)}
                onCardLeftScreen={() => outOfFrame(track.name, index)}
              >
                <TrackCard
                  trackId={track.id}
                  accessToken={accessToken}
                  trackTitle={track?.name}
                  trackArtist={track.artists[0]?.name}
                  image={track.album.images[0]?.url}
                  artistLink={track.artists[0]?.external_urls.spotify}
                />
              </TinderCard>
            ))}
        </div>
        <div className="flex sticky bottom-12 justify-center items-center">
          {isReady && (
            <>
              <Player
                accessToken={accessToken}
                chosenDeviceId={chosenDeviceId}
                recommendedTracks={recommendedTracks}
                likeSongIndex={likeSongIndex}
              />
              <div
                role="button"
                title="Play last song"
                onClick={() => goBack()}
                className="hover:bg-slate-600 rounded-full ms-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
              >
                <Icon path={mdiSync} size={1} color="white" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
