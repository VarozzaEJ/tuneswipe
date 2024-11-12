import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SpotifyWebApi from "spotify-web-api-node";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArtistSearchResult from "./ui/ArtistSearchResult.jsx";
import { useParams } from "react-router-dom";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function SearchArtistsSheet({ accessToken, handler }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [artistId, setArtistId] = useState([]);
  let { artistIds } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  function addArtistId(artistIds) {
    const isAdded = artistId.find((id) => id == artistIds);
    const foundArtistId = artistId.findIndex((id) => id == artistIds);
    if (isAdded) {
      artistId.splice(foundArtistId, 1);
      // toast.error("This artist is already added");
    }
    if (artistId.length >= 10)
      toast.error("A maximum of 10 artists is allowed");
    if (isAdded || artistId.length >= 10) return;
    //NOTE maybe throw a pop error of some sort here
    setArtistId((artistId) => [...artistId, artistIds]);
  }
  console.log(artistId);

  function getReccomendationsBasedOnArtists() {
    if (!accessToken) return;
    if (sessionStorage.getItem("artistIds")) {
      sessionStorage.removeItem("artistIds");
    }
    sessionStorage.setItem("artistIds", `${artistId}`);
    //TODO when navigating for the first time per user, the queue does not work. I suspect that this is because spotify is not technically playing anything at the start of a user's session.
  }

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
      <div className="m-2 h-full">
        <div className="flex justify-center">Search Artists</div>
        <div className=" flex flex-col items-center justify-between">
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
          <div className="w-full fixed bottom-4 flex justify-end mt-5">
            <div>
              <Button
                onClick={() => {
                  getReccomendationsBasedOnArtists();
                  handler();
                }}
                className={"me-5"}
              >
                Get Reccomendations{" "}
                <p className="m-0 ms-2 text-slate-400">{artistId.length}</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
