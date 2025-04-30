import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  // @ts-expect-error Shadcn/ui imports may cause type errors, but they are safe to ignore.
} from "@/components/ui/select";
// @ts-expect-error Shadcn/ui imports may cause type errors, but they are safe to ignore.
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  // @ts-expect-error Explains meta.env does not exist, but it does.
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function ChangeDeviceForm({
  accessToken,
  setChangeDeviceFormOpen,
  setFormSubmitted,
}) {
  const [availableDevices, setAvailableDevices] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    getAvailableDevices();
  }, [accessToken]);

  const getAvailableDevices = async () => {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/devices",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Available devices:", data.devices);
      setAvailableDevices(data.devices);
      return data.devices;
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const transferPlayback = async (deviceId) => {
    await spotifyApi.transferMyPlayback([`${deviceId}`]).then(
      function () {
        console.log("Transfering playback to " + deviceId);
        localStorage.setItem("chosenDeviceId", deviceId);
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  function handleChange(e) {
    localStorage.removeItem("chosenDeviceId");
    console.log("device selected", e);
    transferPlayback(e);
    localStorage.setItem("chosenDeviceId", e);
    toast.success("Device Changed Successfully");
    setFormSubmitted(true);
    spotifyApi.setVolume(75);
  }

  console.log(availableDevices);

  return (
    <>
      <div className="mb-10 md:mb-0">
        {availableDevices.length !== 0 ? (
          <Select onValueChange={handleChange}>
            <SelectTrigger className={"text-black"}>
              <SelectValue placeholder="Choose Your Playback Device" />
            </SelectTrigger>
            <SelectContent>
              {availableDevices.length > 0 ? (
                <SelectGroup>
                  {availableDevices.map((device, index) => (
                    <div key={index}>
                      <SelectItem
                        // onClick={() => {
                        //   chooseThisDevice(device.id);
                        // }}

                        value={device.id}
                      >
                        {device.name}
                      </SelectItem>
                    </div>
                  ))}
                </SelectGroup>
              ) : (
                <SelectGroup>
                  <SelectLabel className="text-destructive pl-1">
                    Open Spotify on any of your devices.
                  </SelectLabel>
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="h-10 w-full" />
        )}
      </div>
    </>
  );
}
