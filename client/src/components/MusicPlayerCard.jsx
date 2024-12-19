import {
  mdiClose,
  mdiDotsHorizontal,
  mdiOpenInNew,
  mdiPlusCircleOutline,
  mdiSpotify,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ExpiredTokenDialog from "./ExpiredTokenDialog.jsx";
import TrackImageInPost from "./TrackImageInPost.jsx";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function MusicPlayerCard({ trackIds }) {
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [open, setOpen] = useState(false);

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
    spotifyApi.setAccessToken(accessToken);
    setAccessToken(accessToken);
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
          setCurrentIndex(data.body.tracks.length - 1);
        })
        .catch(function (error) {
          const isExpired = error.message.includes("expired");
          if (isExpired) {
            setIsExpired(true);
            setOpen(true);
          }
          console.error(error);
        });
    } catch (error) {
      toast.error(error);
    }
  };

  const addSongToYourMusic = async (trackId) => {
    try {
      await spotifyApi.addToMySavedTracks([`${trackId}`]).then(
        function (data) {
          console.log("Added track!");
          toast.success("Added Track!");
          setIsOpen(false);
        },
        function (err) {
          toast.error("An error occured");
          console.log("Something went wrong!", err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isExpired ? (
        <ExpiredTokenDialog open={open} />
      ) : (
        <div className="bg-slate-800 rounded-sm shadow-sm">
          <div className="flex flex-col h-60 md:h-80 justify-center items-center">
            {tracks.map((track, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="absolute w-1/2 flex justify-center items-center"
                key={track.name}
                flickOnSwipe
                swipeRequirementType="position"
                swipeThreshold={50}
                preventSwipe={["down", "up"]}
                onSwipe={(dir) => swiped(dir, track.uri, index)}
                onCardLeftScreen={() => outOfFrame(track.name, index)}
              >
                <TrackImageInPost
                  img={track.album.images[0].url}
                  trackURI={track.album.uri}
                  trackNumber={track.track_number}
                />
              </TinderCard>
            ))}
          </div>
          {tracks[0] && currentIndex >= 0 ? (
            <div className="h-20 flex flex-col justify-center bg-slate-800 rounded-sm shadow-sm">
              <div className=" mx-4 flex justify-between">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 overflow-scroll text-nowrap con">
                    {tracks[currentIndex].name.length > 30 ? (
                      <div className="link_animated">
                        <span className="text-2xl ">
                          {tracks[currentIndex].name}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl ">
                          {tracks[currentIndex].name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-12">
                    <div className="grid grid-cols-12 items-center gap-6 sm:gap-1">
                      <div className="col-span-1  text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out items-center justify-items-center">
                        <Icon path={mdiSpotify} color="white" size={1} />
                      </div>
                      <div className="col-span-10">
                        <a href={tracks[currentIndex].external_urls.spotify}>
                          <span className="text-xl  text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out ">
                            {tracks[currentIndex].artists[0].name}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Drawer open={isOpen} onOpenChange={setIsOpen}>
                    <DrawerTrigger>
                      <span aria-label="Open drawer to see more actions">
                        <Icon
                          title="Open Options Menu"
                          path={mdiDotsHorizontal}
                          size={1.4}
                          color="white"
                          className="cursor-pointer"
                        />
                      </span>
                    </DrawerTrigger>
                    <DrawerContent
                      aria-label="Options for this song"
                      className="bg-slate-800"
                    >
                      <DrawerTitle></DrawerTitle>
                      <DrawerDescription></DrawerDescription>
                      <div className="flex justify-end me-4">
                        <DrawerClose
                          className={
                            "w-16 bg-transparent flex justify-end items-center mt-1 hover:bg-transparent"
                          }
                        >
                          <Icon path={mdiClose} color="white" size={1} />
                        </DrawerClose>
                      </div>
                      <DrawerTitle></DrawerTitle>
                      <DrawerDescription></DrawerDescription>
                      <div
                        aria-describedby="Options for this song"
                        className="w-full mx-auto flex flex-col "
                      >
                        <div className="flex flex-col justify-center items-center mt-3">
                          <img
                            style={{ height: 150, width: 150 }}
                            src={tracks[currentIndex].album.images[0].url}
                            alt={`${tracks[currentIndex].album.name}'s image'`}
                          />
                          <span>{tracks[currentIndex].name}</span>
                          <a href={tracks[currentIndex].artists[0].href}>
                            <span className="text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out">
                              {tracks[currentIndex].artists[0].name}
                            </span>
                          </a>
                        </div>
                        <span
                          onClick={() => {
                            addSongToYourMusic(tracks[currentIndex].id);
                          }}
                          className="flex my-4 text-lg ms-2 cursor-pointer hover:text-slate-600 delay-75 transition-all ease-in-out"
                        >
                          <Icon
                            path={mdiPlusCircleOutline}
                            color="white"
                            className="me-4"
                            size={1}
                          />
                          Save Song
                        </span>
                        {/* <span
                      onClick={() => {
                        skipToNext();
                        }}
                        className="flex mb-4 text-lg cursor-pointer hover:text-slate-600 ms-2 delay-75 transition-all ease-in-out"
                        >
                        <Icon
                        path={mdiDiameterVariant}
                        color="red"
                        className="me-4"
                        size={1}
                        />
                        Skip this Song
                        </span> */}
                        <a
                          href={
                            tracks[currentIndex].artists[0].external_urls
                              .spotify
                          }
                        >
                          <span className="flex mb-4 text-lg ms-2 cursor-pointer hover:text-slate-600 delay-75 transition-all ease-in-out">
                            <Icon
                              path={mdiOpenInNew}
                              color="white"
                              className="me-4"
                              size={1}
                            />
                            Open on Spotify
                          </span>
                        </a>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-20 flex flex-col justify-center bg-slate-800 rounded-sm shadow-sm">
              <div className="mx-4 flex justify-between">
                <div>
                  <Skeleton className={"w-36 mb-3 h-4"} />
                  <Skeleton className={"w-32 h-4"} />
                </div>
                <div className="flex items-center">
                  <Icon
                    title="Open Options Menu"
                    path={mdiDotsHorizontal}
                    size={1.4}
                    color="gray"
                    className=""
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
