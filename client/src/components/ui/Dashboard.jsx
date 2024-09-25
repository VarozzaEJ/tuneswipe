import React, { useEffect, useState } from "react";
import useAuth from "../../services/useAuth.js";
import SpotifyWebApi from "spotify-web-api-node";
import { Button } from "@/components/ui/button";
import ArtistSearchResult from "./ArtistSearchResult.jsx";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function Dashboard({ code }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [chosenDeviceId, setChosenDeviceId] = useState("");
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [artistIds, setArtistIds] = useState([]);

  console.log(chosenDeviceId);

  const navigate = useNavigate();

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

  useEffect(() => {
    getAvailableDevices();
  }, [accessToken]);

  const chooseThisDevice = (deviceId) => {
    try {
      setChosenDeviceId(deviceId);
    } catch (error) {
      console.error(error);
    }
  };

  function handleChange(e) {
    console.log("device selected", e);
    setChosenDeviceId(e);
    setFormSubmitted(true);
    toast.success("Device Changed Successfully");
  }

  function addArtistId(artistId) {
    const isAdded = artistIds.find((id) => id == artistId);
    if (isAdded || artistIds.length >= 10) return;
    //NOTE maybe throw a pop error of some sort here
    setArtistIds((artistIds) => [...artistIds, artistId]);
  }

  function getReccomendationsBasedOnArtists() {
    if (!accessToken) return;

    navigate(`listen/${artistIds}/${chosenDeviceId}`);
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchArtists(search, { limit: 4 }).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.artists.items.map((artist) => {
          return {
            artist: artist.name,
            image: artist.images[2],
            id: artist.id,
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <>
      {formSubmitted ? (
        <div className="w-screen h-screen flex flex-col items-center justify-between">
          <div className="w-80 mt-5 flex">
            <Input
              type={"search"}
              placeholder={"Search Artists"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={"text-black"}
            />
          </div>
          <div className="w-screen flex flex-col items-center">
            {searchResults.map((artist) => (
              <div
                key={artist.id}
                className="w-full flex justify-center"
                onClick={() => {
                  addArtistId(artist.id);
                }}
              >
                <ArtistSearchResult artist={artist} />
              </div>
            ))}
          </div>
          <div className="w-full sticky bottom-4 flex justify-end mt-5">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={getReccomendationsBasedOnArtists}
                className={"me-5"}
              >
                Get Reccomendations{" "}
                <p className="m-0 ms-2 text-slate-400">{artistIds.length}</p>
              </Button>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
          <div>
            {availableDevices.devices && (
              <Select onValueChange={handleChange}>
                <SelectTrigger className={"text-black"}>
                  <SelectValue placeholder="Choose Your Playback Device" />
                </SelectTrigger>
                <SelectContent
                  onClick={() => {
                    console.log("Working");
                    toast({
                      description: `Playback transferred to ${device.name}`,
                    });
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
        </div>
      )}
    </>
  );
}
