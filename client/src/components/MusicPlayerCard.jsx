import React, { useEffect, useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function MusicPlayerCard({ trackIds }) {
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(tracks.length)
        .fill(0)
        .map((i) => React.createRef()),
    [tracks]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < tracks.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = async (direction, songURI, index) => {
    setLastDirection(direction);
    //  setCurrentSongIndex(currentSongIndex + 1);
    //  setLikeSongIndex(likeSongIndex + 1);
    if (direction == "left")
      if (direction == "right")
        if (currentIndex > 1) {
          //  addSongToQueue(recommendations[currentIndex - 2].uri);
        }

    updateCurrentIndex(index - 1);
    //  setLastSwipedURI(songURI);
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
    if (canSwipe && currentIndex < tracks.length) {
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

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
    spotifyApi.setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    getTrackInfo();
  }, [accessToken]);

  const getTrackInfo = async () => {
    try {
      await spotifyApi
        .getTracks(trackIds)
        .then(function (data) {
          console.log(data.body);
          setTracks(data.body.tracks);
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
      <div className="bg-slate-400 rounded-sm shadow-sm">
        <div className="flex flex-col h-60 md:h-80 justify-between items-center">
          {tracks.map((track, index) => (
            <>
              <TinderCard
                ref={childRefs[index]}
                className="absolute w-1/2 flex justify-center"
                key={track.name}
                flickOnSwipe
                swipeRequirementType="position"
                swipeThreshold={50}
                preventSwipe={["down", "up"]}
                onSwipe={(dir) => swiped(dir, track.uri, index)}
                onCardLeftScreen={() => outOfFrame(track.name, index)}
              >
                <img
                  src={track.album.images[index].url}
                  className="w-full max-w-[225px] md:max-w-[300px]"
                  alt=""
                  draggable="false"
                />
              </TinderCard>
              <span>{track.name}</span>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
