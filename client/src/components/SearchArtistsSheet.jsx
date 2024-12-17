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
  const [artistName, setArtistName] = useState("");
  const [artistTopSong, setArtistTopSong] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  function addArtistId(artist) {
    // const isAdded = artistName.find((name) => name == artist);
    // const foundArtistId = artistName.findIndex((name) => name == artist);
    // if (isAdded) {
    //   const newName = artistName.filter((name) => name !== isAdded);
    //   setArtistName(newName);
    // }
    // if (artistName.length >= 1) toast.error("A maximum of 1 artist is allowed");
    // if (isAdded || artistName.length > 1) return;
    // //NOTE maybe throw a pop error of some sort here
    setArtistName(artist);
  }
  console.log(artistName);
  function getReccomendationsBasedOnArtists() {
    if (!accessToken) return;
    sessionStorage.setItem("artistName", `${artistName}`);
    sessionStorage.setItem("artistTopSong", `${artistTopSong}`);
    //TODO when navigating for the first time per user, the queue does not work. I suspect that this is because spotify is not technically playing anything at the start of a user's session.
  }

  async function getTopSong(artistId) {
    const topSongs = await spotifyApi.getArtistTopTracks(artistId, "US");
    setArtistTopSong(topSongs.body.tracks[0].name);
  }

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchArtists(search, { limit: 1 }).then((res) => {
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
                  addArtistId(artist.artist);
                  getTopSong(artist.id);
                }}
              >
                <ArtistSearchResult artist={artist} />
              </div>
            ))}
          </div>
          <div className="w-full fixed bottom-4 flex justify-end mt-5">
            <div>
              {artistName.length > 0 ? (
                <Button
                  onClick={() => {
                    getReccomendationsBasedOnArtists();
                    handler();
                  }}
                  className={"me-5"}
                >
                  Get Reccomendations{" "}
                </Button>
              ) : (
                <Button className={"me-5"} variant={"destructive"}>
                  Choose an Artist{" "}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
