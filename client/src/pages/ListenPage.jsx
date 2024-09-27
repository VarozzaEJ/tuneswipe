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
  const [playingTrack, setPlayingTrack] = useState("");
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [chosenDeviceId, setChosenDeviceId] = useState("");
  const [artistIds, setArtistIds] = useState([]);
  const searchParams = useParams();
  //NOTE this grabbing an array that could not exist possibly could mess things up
  const [currentIndex, setCurrentIndex] = useState(
    recommendations.tracks?.length - 1
  );
  const [lastDirection, setLastDirection] = useState();

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(recommendations.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < recommendations.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = async (direction, nameToDelete, index) => {
    setLastDirection(direction);
    console.log(index);
    if (direction == "left") {
      await skipToNext();
    }
    updateCurrentIndex(index - 1);
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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
    setIds();
    setDeviceId();
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
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  }, [artistIds, accessToken]);

  const getTrackDetails = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/0wI7QkCcs8FUQE1OkXUIqd`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      }
    );
    console.log("🌞", response);
  };

  useEffect(() => {
    if (!accessToken) return;
    getTrackDetails;
  }, [accessToken]);

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
      <div className="container overflow-y-hidden h-screen  flex-col flex justify-center items-center">
        {recommendations &&
          recommendations.map((track, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="absolute w-[350px] h-[375px]"
              key={track.name}
              flickOnSwipe
              onSwipe={(dir) => swiped(dir, track.name, index)}
              onCardLeftScreen={() => outOfFrame(track.name, index)}
            >
              <TrackCard
                trackTitle={track?.name}
                trackArtist={track.artists[0]?.name}
                image={track.album.images[0]?.url}
              />
            </TinderCard>
          ))}
      </div>
      <div className="flex sticky bottom-12 justify-center items-center">
        <Player
          accessToken={accessToken}
          chosenDeviceId={chosenDeviceId}
          recommendedTracks={recommendedTracks}
        />
      </div>
    </>
  );
}
