import { mdiPlay, mdiTabletCellphone } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangeDeviceForm from "./ChangeDeviceForm.jsx";
import useNoActiveDeviceHook from "../services/useNoActiveDeviceHook.js";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function TrackImageInPost({ img, trackURI, trackNumber }) {
  const [accessToken, setAccessToken] = useState("");
  const [changeDeviceFormOpen, setChangeDeviceFormOpen] = useState(false);
  const [noActiveDeviceError, setNoActiveDeviceError] = useState(false);
  const value = useNoActiveDeviceHook(noActiveDeviceError);

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!value || undefined) return;
    setChangeDeviceFormOpen(true);
  }, [value]);

  const playSong = async () => {
    if (!accessToken) return;
    await spotifyApi.setShuffle(false).catch(async (err) => {
      if (err.message.includes("NO_ACTIVE_DEVICE")) {
        setNoActiveDeviceError(true);
      }
    });
    const offset = trackNumber - 1;
    await spotifyApi.setVolume(75);
    await spotifyApi.play({
      context_uri: `${trackURI}`,
      offset: {
        position: offset,
      },
    });
  };

  return (
    <div
      className="cursor-pointer showhim"
      onPointerDown={() => {
        playSong();
      }}
    >
      <Dialog
        open={changeDeviceFormOpen}
        onOpenChange={setChangeDeviceFormOpen}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className={"bg-primary w-5/6 rounded-sm"}>
          <DialogHeader>
            <DialogTitle className={"mb-3"}>Change Playback Device</DialogTitle>
            <DialogDescription></DialogDescription>
            <ChangeDeviceForm
              setChangeDeviceFormOpen={setChangeDeviceFormOpen}
              accessToken={accessToken}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Icon
        className="absolute showme left-[50%] top-[50%] flex justify-center items-center transition-all ease-in-out  translate-x-[-50%] translate-y-[-50%]   w-20 h-20 z-50"
        path={mdiPlay}
        color="white"
        size={3}
      />
      <div>
        <img
          draggable="false"
          src={img}
          fetchpriority="high"
          className="w-full max-w-[225px] md:max-w-[300px] rounded-sm"
          alt=""
        />
      </div>
    </div>
  );
}
