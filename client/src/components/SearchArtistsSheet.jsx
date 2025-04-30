import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ArtistSearchResult from "./ui/ArtistSearchResult.jsx";
import {
  mdiGuitarAcoustic,
  mdiGuitarElectric,
  mdiMicrophone,
  mdiPiano,
  mdiSpeaker,
  mdiStarOutline,
  mdiViolin,
} from "@mdi/js";
import Icon from "@mdi/react";
import GenreCard from "./GenreCard.jsx";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

export default function SearchArtistsSheet({
  accessToken,
  handler,
  setIsOnRightSong,
}) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  function getRecommendationsBasedOnArtists(artistName, artistTopSong) {
    if (!accessToken) return;
    sessionStorage.setItem("artistName", `${artistName}`);
    sessionStorage.setItem("artistTopSong", `${artistTopSong}`);
  }

  async function getTopSong(artistId) {
    const topSongs = await spotifyApi.getArtistTopTracks(artistId, "US");
    return topSongs.body.tracks[0].name;
  }

  //TODO add more genres after deploying this app to the public.
  useEffect(() => {
    if (!accessToken) return;
    if (genre === "") return;
    spotifyApi
      .search(`genre:${genre}`, ["artist"], { limit: 5 })
      .then((res) => {
        setSearchResults(
          res.body.artists.items.map((artist) => {
            return {
              artist: artist.name,
              image: artist.images[2],
              id: artist.id,
              genre: artist.genres[0] ? artist.genres[0] : "No Genre",
            };
          })
        );
      });
  }, [genre, accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchArtists(search, { limit: 5 }).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.artists.items.map((artist) => {
          return {
            artist: artist.name,
            image: artist.images[2],
            id: artist.id,
            genre: artist.genres[0] ? artist.genres[0] : "No Genre",
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    // Fetch popular artists when the component mounts
    spotifyApi.searchArtists("popular", { limit: 5 }).then((res) => {
      setPopularArtists(
        res.body.artists.items.map((artist) => {
          return {
            artist: artist.name,
            image: artist.images[2],
            id: artist.id,
            genre: artist.genres[0] ? artist.genres[0] : "No Genre",
          };
        })
      );
      setLoading(false);
    });
  }, [accessToken]);

  return (
    <>
      <div className="m-2 h-full">
        <div className="flex justify-center mb-5 text-xl font-bold">
          Get Recommendations
        </div>
        <div className=" flex flex-col h-full items-center justify-between">
          <div className="w-11/12 sticky top-0 z-10 md:w-3/4 flex">
            <Input
              type={"search"}
              placeholder={"Search Artists"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={" bg-slate-700 "}
            />
          </div>
          {searchResults.length == 0 && (
            <>
              <div className="w-full my-4">
                <span className="text-slate-400">Popular Genres</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                <div
                  onClick={() => {
                    setGenre("rock");
                  }}
                >
                  <GenreCard
                    name={"Rock"}
                    fromColor={"from-orange-600"}
                    toColor={"to-orange-700"}
                    icon={mdiGuitarElectric}
                  />
                </div>
                <div
                  onClick={() => {
                    setGenre("country");
                  }}
                >
                  <GenreCard
                    name={"Country"}
                    fromColor={"from-orange-400"}
                    toColor={"to-orange-600"}
                    icon={mdiGuitarAcoustic}
                  />
                </div>
                <div
                  onClick={() => {
                    setGenre("hip-hop");
                  }}
                >
                  <GenreCard
                    name={"Hip-Hop"}
                    fromColor={"from-blue-400"}
                    toColor={"to-blue-600"}
                    icon={mdiSpeaker}
                  />
                </div>
                <div
                  onClick={() => {
                    setGenre("pop");
                  }}
                >
                  <GenreCard
                    name={"Pop"}
                    fromColor={"from-purple-400"}
                    toColor={"to-purple-600"}
                    icon={mdiMicrophone}
                  />
                </div>
                <div
                  onClick={() => {
                    setGenre("jazz");
                  }}
                >
                  <GenreCard
                    name={"Jazz"}
                    fromColor={"from-yellow-400"}
                    toColor={"to-yellow-600"}
                    icon={mdiPiano}
                  />
                </div>
                <div
                  onClick={() => {
                    setGenre("classical");
                  }}
                >
                  <GenreCard
                    name={"Classical"}
                    fromColor={"from-green-400"}
                    toColor={"to-green-600"}
                    icon={mdiViolin}
                  />
                </div>
              </div>
              <div className="w-full my-4">
                <span className="text-slate-400 flex">
                  <Icon
                    path={mdiStarOutline}
                    color={"yellow"}
                    size={1}
                    className="pe-1"
                  />
                  Popular Artists
                </span>
              </div>
              {loading ? (
                <>
                  <Skeleton className={"w-full h-[1000px] my-1"} />
                </>
              ) : (
                <div className="w-full">
                  {popularArtists.map((artist) => (
                    <div
                      key={artist.id}
                      className="w-full flex justify-center"
                      onClick={async () => {
                        const topSong = await getTopSong(artist.id);
                        getRecommendationsBasedOnArtists(
                          artist.artist,
                          topSong
                        );
                        handler();
                        // setIsOnRightSong(false);
                      }}
                    >
                      <ArtistSearchResult artist={artist} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="w-full flex flex-col h-full justify-center items-center">
            {searchResults.map((artist) => (
              <div
                key={artist.id}
                className="w-full flex justify-center"
                onClick={async () => {
                  const topSong = await getTopSong(artist.id);
                  getRecommendationsBasedOnArtists(artist.artist, topSong);
                  handler();
                  // setIsOnRightSong(false);
                }}
              >
                <ArtistSearchResult artist={artist} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
