import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "../services/useAuth.js";
import { useNavigate } from "react-router-dom";
import TrackCard from "../components/ui/TrackCard.jsx";
import {
  mdiChatOutline,
  mdiCheckCircle,
  mdiCheckCircleOutline,
  mdiCloseCircle,
  mdiCloseCircleOutline,
  mdiDotsHorizontal,
  mdiFinance,
  mdiGraph,
  mdiHome,
  mdiPencilPlusOutline,
  mdiPlay,
  mdiReplay,
  mdiRewind,
  mdiSync,
  mdiTabletCellphone,
} from "@mdi/js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@mdi/react";
import Player from "../components/Player.jsx";
import axios from "axios";
import PreBuiltPlayer from "../components/PreBuiltPlayer.jsx";
import TinderCard from "react-tinder-card";
import Login from "../components/Login.jsx";
import { AppState } from "../AppState.js";
import ChangeDeviceForm from "../components/ChangeDeviceForm.jsx";
import { toast } from "sonner";
import ExpiredTokenDialog from "../components/ExpiredTokenDialog.jsx";
import { Button } from "@/components/ui/button";
import SearchArtistsSheet from "../components/SearchArtistsSheet.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import ListenPageMusicCardLoading from "../components/ListenPageMusicCardLoading.tsx";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

const main = document.getElementById("main");
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
  const [likeColor, setLikeColor] = useState("white");
  const [dislikeColor, setDislikeColor] = useState("white");
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [isOnRightSong, setIsOnRightSong] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [rainSoundId, setRainSoundId] = useState("3Ec830TpI83UCdYDHkBScO");
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState("");
  const [rightSongAdded, setRightSongAdded] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [expiredTokenDialogOpen, setExpiredTokenDialogOpen] = useState(false);
  const [isReadyForQueueCheck, setIsReadyForQueueCheck] = useState(false);
  const [recommendedMusicOpen, setRecommendedMusicOpen] = useState(false);
  const [optionsPopupOpen, setOptionsPopupOpen] = useState(false);
  const [count2, setCount2] = useState(0);

  const navigate = useNavigate();

  console.log("🎤", lastSwipedURI);
  const currentIndexRef = useRef(currentIndex);

  const handleCount = () => {
    setCount2(count2 + 1);
  };

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
      setDislikeColor("red");
      setLikeColor("white");
    }
    if (direction == "right") {
      await addSongToYourMusic(recommendedTracks[currentIndexRef.current].id);
      await skipToNext();
      setLikeColor("green");
      setDislikeColor("white");
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
    // if (canSwipe && currentIndex < recommendations.length) {
    //   await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    // }
    console.log("working?");
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    setCurrentSongIndex(currentSongIndex - 1);
    setLikeSongIndex(likeSongIndex - 1);
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
    await addSongToQueue(lastSwipedURI);
    await skipToNext();
    await skipToNext();
    await addSongToQueue(recommendations[currentIndex].uri);
  };

  const initialSkipToNext = async () => {
    let isReady = false;
    await spotifyApi.skipToNext().then(
      function () {
        console.log("Skip to next");
        setIsReadyForQueueCheck(true);
        isReady = true;
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.error("Something went wrong!", err);
        const isExpired = err.message.includes("expired");
        if (isExpired) {
          setIsExpired(true);
          setExpiredTokenDialogOpen(true);
        }
      }
    );
    return isReady;
  };

  const skipToNext = async () => {
    await spotifyApi.skipToNext().then(
      function () {
        console.log("Skip to next");
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.error("Something went wrong!", err);
        const isExpired = err.message.includes("expired");
        if (isExpired) {
          setIsExpired(true);
          setExpiredTokenDialogOpen(true);
        }
      }
    );
  };

  // async function skip() {
  //   await spotifyApi.skipToNext().then(
  //     function () {
  //       console.log("Skip to next");
  //     },
  //     function (err) {
  //       //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
  //       console.log("Something went wrong!", err);
  //     }
  //   );
  // }

  const startPlaying = async () => {
    await spotifyApi.play();
  };

  const addSongToQueue = async (trackUri) => {
    if (!accessToken) return;
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
        if (response.status == 401) {
          setIsExpired(true);
          setExpiredTokenDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Error adding song to queue", error);
    }
  };

  const getUsersQueue = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/player/queue`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.currently_playing?.id);
      console.log(response.data?.queue);
      setQueueLength(response.data.queue?.length);
      if (response.data.currently_playing !== null) {
        setCurrentlyPlayingId(response.data.currently_playing?.id);
      }
      if (response.data.queue.length == 0) {
        // setIsOnRightSong(true);
        setRightSongAdded(true);
      }
    } catch (error) {
      console.error(error);
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
    setDeviceId();
    setIsReady(true);
  }, []);

  const checkIfRightSong = async () => {
    if (rightSongAdded) return;
    // await spotifyApi.play({
    //   context_uri: "spotify:track:5XSKC4d0y0DfcGbvDOiL93",
    // });
    const timeout = setTimeout(() => {
      addSongToQueue("spotify:track:3Ec830TpI83UCdYDHkBScO");
    }, 1000);
    await spotifyApi.setVolume(0);
    setRightSongAdded(true);
    return () => clearTimeout(timeout);
  };

  const skipAndGetQueue = async () => {
    const isReady = await initialSkipToNext();
    console.log("💘", isReady);
    if (isReady) {
      await getUsersQueue();
    }
    // setIsReadyForQueueCheck(false);
  };

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
    startPlaying();
    checkIfRightSong();
    getUsersQueue();
  }, [accessToken]);

  //FIXME create better functionality for when the queue is nothing/doesn't exist. I can't figure out how to get the queue to not exist even though I did it by accident. The second a song is played, it will replay over and over.
  useEffect(() => {
    console.log("running");
    if (!accessToken || !rightSongAdded || currentIndex !== 0 || isOnRightSong)
      return;
    const timeout = setTimeout(() => {
      skipAndGetQueue();
      console.log("🌞");
      setCount(count + 1);
    }, 500);
    if (currentlyPlayingId == rainSoundId) {
      setIsOnRightSong(true);
    }
    return () => clearTimeout(timeout);
  }, [
    accessToken,
    rightSongAdded,
    currentIndex,
    isOnRightSong,
    skipAndGetQueue,
    count,
    queueLength,
    currentlyPlayingId,
    rainSoundId,
  ]);

  useEffect(() => {
    if (accessToken.length == 0 || !isOnRightSong || !rightSongAdded) return;
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
          const isExpired = err.message.includes("expired");
          if (isExpired) {
            setIsExpired(true);
            setExpiredTokenDialogOpen(true);
          }
        }
      );
    setIsReady(true);
  }, [artistIds, accessToken, isOnRightSong]);

  function setIds() {
    if (!sessionStorage.getItem("artistIds")) {
      setRecommendedMusicOpen(true);
      toast.error("Please Choose Recommendations");
      return;
    }
    const ids = sessionStorage
      .getItem("artistIds")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setArtistIds(ids);
  }
  useEffect(() => {
    setIds();
    spotifyApi.setVolume(0);
    skipToNext();
    skipToNext();
    spotifyApi.setVolume(0);
    if (sessionStorage.getItem("artistIds")) setRecommendedMusicOpen(false);
    setOptionsPopupOpen(false);
  }, [count2]);

  function setDeviceId() {
    const deviceId = localStorage.getItem("chosenDeviceId");
    setChosenDeviceId(deviceId);
  }

  //TODO I think I should try and keep the artists I select in localStorage. This way, when I eventually add the different tabs the user won't have to readd what artists they want to listen to. I should set it when I hit the get recommendations button. I'll both simultaneously remove the id's in local storage and set the new ones at the same time. Then, in the setIds() function above, I will try and find the id's in local storage

  return (
    <>
      <div className="fixed top-2 w-screen">
        {isExpired && <ExpiredTokenDialog open={expiredTokenDialogOpen} />}
        <div className="flex justify-between mx-5">
          <div role="button" className="flex items-center">
            <Sheet
              open={recommendedMusicOpen}
              onOpenChange={setRecommendedMusicOpen}
            >
              <SheetTrigger>
                <div>
                  <Icon path={mdiFinance} color="white" size={1} />
                </div>
              </SheetTrigger>
              <SheetContent
                className={
                  "bg-slate-800 w-screen sm:max-w-screen overflow-y-scroll max-w-screen"
                }
              >
                <SearchArtistsSheet
                  handler={handleCount}
                  accessToken={accessToken}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div>
            <span className="text-3xl">For You</span>
          </div>
          <Dialog>
            <DialogTrigger>
              <div>
                <Icon path={mdiTabletCellphone} color="white" size={1} />
              </div>
            </DialogTrigger>
            <DialogContent className={"bg-primary w-5/6 rounded-sm"}>
              <DialogHeader>
                <DialogTitle className={"mb-3"}>
                  Change Playback Device
                </DialogTitle>
                <DialogDescription></DialogDescription>
                <ChangeDeviceForm accessToken={accessToken} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="container overflow-y-hidden h-screen  flex-col flex justify-center">
        <div className="sm:h-3/4 h-full flex items-center justify-center">
          <div className="z-10 fixed left-1 sm:left-4">
            <Icon path={mdiCloseCircle} color={dislikeColor} size={2} />
          </div>
          {recommendations.length !== 0 ? (
            recommendations.map((track, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="absolute w-[260px] sm:w-[350px] h-[375px] "
                key={track.name}
                flickOnSwipe
                swipeRequirementType="position"
                swipeThreshold={50}
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
            ))
          ) : (
            <ListenPageMusicCardLoading />
          )}
          <div className="z-10 fixed right-1 sm:right-4">
            <Icon path={mdiCheckCircle} color={likeColor} size={2} />
          </div>
        </div>
        <div className="flex sticky bottom-12 justify-center items-center">
          {isReady && (
            <>
              <Player
                isOnRightSong={isOnRightSong}
                accessToken={accessToken}
                chosenDeviceId={chosenDeviceId}
                recommendedTracks={recommendedTracks}
                likeSongIndex={likeSongIndex}
              />
              <div className="flex flex-col ms-4 items-center justify-center">
                <div
                  role="button"
                  title="Play last song"
                  onClick={() => goBack()}
                  className="hover:bg-slate-600 rounded-full  bg-slate-500 w-11 h-11 flex items-center justify-center"
                >
                  <Icon path={mdiSync} size={1} color="white" />
                </div>
                <span className="text-slate-400">Back</span>
              </div>
            </>
          )}
        </div>
        <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
          <div className="">
            <Icon path={mdiHome} color="white" size={1} />
          </div>
          <Link to={"/posts"}>
            <div className="">
              <Icon path={mdiChatOutline} color="white" size={1} />
            </div>
          </Link>
          <div className="">
            <Link to={"/create"}>
              <Icon path={mdiPencilPlusOutline} color="white" size={1} />
            </Link>
          </div>
          <Login profilePic={AppState.account?.picture} />
        </div>
      </div>
    </>
  );
}
