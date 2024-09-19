import React, { useEffect } from "react";
import useAuth from "../../services/useAuth.js";
import SpotifyWebApi from "spotify-web-api-node";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const spotifyApi = new SpotifyWebApi({
  clientId: "c4f463066209462aa6798856d58701d9",
});
export default function Dashboard({ code }) {
  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    // spotifyApi.getAvailableGenreSeeds().then(
    //   function (data) {
    //     let genreSeeds = data.body.genres;
    //     setGenres(genreSeeds);
    //   },
    //   function (err) {
    //     console.log("Something went wrong!", err);
    //   }
    // );

    spotifyApi
      .getRecommendations({
        min_energy: 0.4,
        seed_artists: ["6mfK6Q2tzLMEchAr0e9Uzu", "4DYFVNKZ1uixa6SQTvzQwJ"],
        min_popularity: 50,
      })
      .then(
        function (data) {
          let recommendations = data.body;
          console.log(recommendations);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  }, [accessToken]);

  return <></>;
}
