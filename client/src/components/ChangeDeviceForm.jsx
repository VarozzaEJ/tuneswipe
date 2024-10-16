import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function ChangeDeviceForm({ accessToken }) {
  const [availableDevices, setAvailableDevices] = useState([]);
  const [chosenDeviceId, setChosenDeviceId] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    getAvailableDevices();
  }, [accessToken]);

  const getAvailableDevices = async () => {
    if (!accessToken) return;

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
      setAvailableDevices(data);
      return data.devices;
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const transferPlayback = async (deviceId) => {
    await spotifyApi.transferMyPlayback([`${deviceId}`]).then(
      function () {
        console.log("Transfering playback to " + deviceId);
      },
      function (err) {
        console.log(chosenDeviceId);
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
  }

  return (
    <>
      <div className="mb-10 md:mb-0">
        {availableDevices.devices && (
          <Select onValueChange={handleChange}>
            <SelectTrigger className={"text-black"}>
              <SelectValue placeholder="Choose Your Playback Device" />
            </SelectTrigger>
            <SelectContent
              onClick={() => {
                console.log("Working");
              }}
            >
              <SelectGroup>
                {availableDevices.devices.map((device, index) => (
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
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
}
