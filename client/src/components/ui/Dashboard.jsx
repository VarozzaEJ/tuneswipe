import React, { useEffect, useState } from "react";
import useAuth from "../../services/useAuth.js";
import SpotifyWebApi from "spotify-web-api-node";
import { Button } from "@/components/ui/button";
import ArtistSearchResult from "./ArtistSearchResult.jsx";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [artistIds, setArtistIds] = useState([]);

  const navigate = useNavigate();

  function addArtistId(artistId) {
    const isAdded = artistIds.find((id) => id == artistId);
    if (isAdded || artistIds.length >= 10) return;
    //NOTE maybe throw a pop error of some sort here
    setArtistIds((artistIds) => [...artistIds, artistId]);
  }

  function getReccomendationsBasedOnArtists() {
    if (!accessToken) return;

    navigate(`listen/${artistIds}`);
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
    </>
  );
}
