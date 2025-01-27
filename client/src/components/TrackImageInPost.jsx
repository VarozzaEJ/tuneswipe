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

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function TrackImageInPost({ img, trackURI, trackNumber }) {
  const [accessToken, setAccessToken] = useState("");
  const [changeDeviceFormOpen, setChangeDeviceFormOpen] = useState(false);
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
  //TODO set up error handling for whens Spotify api can't connect to the active device.
  const playSong = async () => {
    if (!accessToken) return;
    await spotifyApi.setShuffle(false).catch(async (err) => {
      if (err.message.includes("NO_ACTIVE_DEVICE")) {
        const devices = await spotifyApi.getMyDevices();
        const activeDevice = await devices.body.devices.filter((device) => {
          device.is_active === true;
        });
        if (activeDevice.length == 0) {
          //TODO playing music on Spotify might not be how this gets fixed. You might need to change the active device on the form.
          toast.error(
            "You do not have a currently active device, please start playing music on Spotify",
            {
              action: {
                label: "Change Device",
                onClick: () => {
                  setChangeDeviceFormOpen(true);
                },
              },
            }
          );
        } else if (activeDevice.length == 1) {
          toast.error(
            `Your current active device is: ${activeDevice[0].name}. Please start playing any song in Spotify on this device OR change your active device.`,
            {
              action: {
                label: "Change Device",
                onClick: () => {
                  setChangeDeviceFormOpen(true);
                },
              },
            }
          );
        }
      }
    });
    const offset = trackNumber - 1;
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
          className="w-full max-w-[225px] md:max-w-[300px] rounded-sm"
          alt=""
        />
      </div>
    </div>
  );
}
