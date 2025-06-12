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
import SearchArtistsSheet from "../SearchArtistsSheet.jsx";
import ChangeDeviceForm from "../ChangeDeviceForm.jsx";

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
  const [artistName, setArtistName] = useState([]);
  const [artistTopSong, setArtistTopSong] = useState("");
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

  console.log(formSubmitted);

  // function addArtistId(artist) {
  //   const isAdded = artistName.find((name) => name == artist);
  //   const foundArtistId = artistName.findIndex((name) => name == artist);
  //   if (isAdded) {
  //     const newName = artistName.filter((name) => name !== isAdded);
  //     setArtistName(newName);
  //   }
  //   if (artistName.length >= 1) toast.error("A maximum of 1 artist is allowed");
  //   if (isAdded || artistName.length > 1) return;
  //   //NOTE maybe throw a pop error of some sort here
  //   setArtistName((artistNames) => [...artistNames, artist]);
  // }

  // async function getTopSong(artistId) {
  //   const topSongs = await spotifyApi.getArtistTopTracks(artistId, "US");
  //   setArtistTopSong(topSongs.body.tracks[0].name);
  // }

  // function getRecommendationsBasedOnArtists() {
  //   if (!accessToken) return;
  //   if (artistName.length == 0) {
  //     toast.error("Choose at least one artist.");
  //     return;
  //   }
  //   sessionStorage.setItem("artistName", `${artistName}`);
  //   sessionStorage.setItem("artistTopSong", `${artistTopSong}`);
  //   navigate(`listen`);
  //   //TODO when navigating for the first time per user, the queue does not work. I suspect that this is because spotify is not technically playing anything at the start of a user's session.
  // }

  // useEffect(() => {
  //   if (localStorage.getItem("chosenDeviceId")) setFormSubmitted(true);
  //   if (!accessToken) return;
  //   spotifyApi.setAccessToken(accessToken);
  // }, [accessToken]);

  // useEffect(() => {
  //   if (!search) return setSearchResults([]);
  //   if (!accessToken) return;

  //   let cancel = false;
  //   spotifyApi.searchArtists(search, { limit: 1 }).then((res) => {
  //     if (cancel) return;
  //     setSearchResults(
  //       res.body.artists.items.map((artist) => {
  //         return {
  //           artist: artist.name,
  //           image: artist.images[2],
  //           id: artist.id,
  //         };
  //       })
  //     );
  //   });
  //   return () => (cancel = true);
  // }, [search, accessToken]);

  const routeToListenPage = () => {
    navigate("/listen");
  };

  return (
    <>
      {formSubmitted ? (
        <div className="w-screen sm:max-w-screen  max-w-screen">
          <SearchArtistsSheet
            handler={routeToListenPage}
            setIsOnRightSong={null}
            accessToken={accessToken}
          />
        </div>
      ) : (
        <div className="w-full flex justify-center items-end h-full">
          {accessToken && (
            <ChangeDeviceForm
              accessToken={accessToken}
              setChangeDeviceFormOpen={setFormSubmitted}
              setFormSubmitted={setFormSubmitted}
            />
          )}
        </div>
      )}
    </>
  );
}
