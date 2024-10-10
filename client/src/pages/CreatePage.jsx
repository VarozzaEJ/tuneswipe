import {
  mdiAccount,
  mdiAccountOutline,
  mdiChatOutline,
  mdiHome,
  mdiHomeOutline,
  mdiImage,
  mdiMusicNote,
  mdiPencilPlus,
  mdiPencilPlusOutline,
  mdiPlus,
  mdiPoll,
  mdiSpotify,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Login from "../components/Login.jsx";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function CreatePage() {
  const [accessToken, setAccessToken] = useState("");
  const [musicCardsReady, setMusicCardsReady] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const getUsersLikedSongs = async () => {
    await spotifyApi.getMyTopTracks().then(
      function (data) {
        let topTracks = data.body.items;
        setLikedSongs(topTracks);
        console.log(topTracks);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  };
  return (
    <>
      <div className="container h-full justify-between flex flex-col">
        <div className="flex justify-center text-3xl">
          <span className="my-4">Create post</span>
        </div>
        <form className="flex-grow flex flex-col justify-between">
          <textarea
            className="bg-slate-900 w-full h-20 focus:outline-none"
            placeholder="Share a song or write a note..."
            maxLength={500}
            minLength={5}
          ></textarea>
          <div className="grid grid-cols-2 mb-10 justify-items-center">
            <div className="col-span-1">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button onClick={getUsersLikedSongs} className="">
                    <div>
                      <Icon path={mdiMusicNote} color="white" size={1} />
                      <span className="text-slate-400 mt-1">Mix</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 music-drawer h-5/6 overflow-y-scroll after:top-full after:right-0 after:h-full">
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                  <div className="flex-col flex mx-5">
                    {likedSongs.map((song, index) => (
                      <div
                        key={index}
                        className="flex justify-between mb-4 cursor-pointer hover:bg-slate-700 transition-all ease-in-out rounded-sm"
                      >
                        <div className="flex">
                          <img
                            className="rounded-sm"
                            src={song.album.images[2].url}
                            alt={`Cover image for ${song.name}`}
                          />
                          <div className="flex flex-col justify-center ms-4">
                            <span>{song.name}</span>
                            <span className="flex text-slate-400">
                              <Icon path={mdiSpotify} color="white" size={1} />
                              {song.artists[0].name}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <Icon path={mdiPlus} color="white" size={1} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    {/* <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                      </DrawerClose> */}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            {/* <div className="col-span-1">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="">
                    <div>
                      <Icon path={mdiPoll} color="white" size={1} />
                      <span className="text-slate-400 mt-1">Poll</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 h-5/6">
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                  <DrawerFooter>
                    <Button>Submit</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div> */}
            <div className="col-span-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <div className="flex flex-col justify-center items-center">
                      <Icon path={mdiImage} color="white" size={1} />
                      <span className="text-slate-400">Photo</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md w-5/6 bg-slate-800 rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Upload Photo</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center ">
                    <div className="d-flex justify-content-center">
                      <div className="bg-subtle rounded-lg h-52 w-52 flex justify-center items-center">
                        <Icon path={mdiImage} color="white" />
                      </div>
                      {/* <div v-else>
                                    <img className="rounded h-20 w-20" />
                                </div> */}
                    </div>
                    <div className="flex items-center w-full mt-5">
                      <div className="grid flex-1 gap-2">
                        <Input
                          id="link"
                          type="url"
                          placeholder="Photo URL"
                          className="bg-slate-800"
                        />
                      </div>
                      <Button size="sm" className="px-3 ms-1">
                        Save
                      </Button>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
      </div>
      <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
        <div className="cursor-pointer">
          <Icon path={mdiHomeOutline} color="white" size={1} />
        </div>
        <div className="cursor-pointer">
          <Icon path={mdiChatOutline} color="white" size={1} />
        </div>
        <div className="cursor-pointer">
          <Icon path={mdiPencilPlus} color="white" size={1} />
        </div>
        <Login />
      </div>
    </>
  );
}
