import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "../services/useAuth.js";
import { useNavigate } from "react-router-dom";
import TrackCard from "../components/ui/TrackCard.jsx";
import { mdiPlay, mdiReplay, mdiRewind, mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import Player from "../components/Player.jsx";
import axios from "axios";
import PreBuiltPlayer from "../components/PreBuiltPlayer.jsx";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function ListenPage() {
  const [playingTrack, setPlayingTrack] = useState("");
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [recommendations, setRecommendations] = useState({});
  const [artistIds, setArtistIds] = useState([]);
  const searchParams = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
    setIds();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  function chooseTrack(track) {
    setPlayingTrack(track);
  }

  useEffect(() => {
    if (accessToken.length == 0) return;

    spotifyApi
      .getRecommendations({
        min_energy: 0.4,
        //NOTE length of this array can only be <10 artists?
        seed_artists: artistIds,
        min_popularity: 50,
      })
      .then(
        function (data) {
          let recommendations = data.body;
          console.log(recommendations);
          setRecommendations(data.body);
          setPlayingTrack(data.body.tracks[0].uri);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  }, [artistIds, accessToken]);

  const getTrackDetails = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/0wI7QkCcs8FUQE1OkXUIqd`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      }
    );
    console.log("🌞", response);
  };

  useEffect(() => {
    if (!accessToken) return;
    getTrackDetails;
  }, [accessToken]);

  function setIds() {
    const ids = searchParams.artistIds
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setArtistIds(ids);
  }

  return (
    <>
      <div className="container h-screen flex-col flex justify-center items-center">
        {recommendations.tracks && (
          <TrackCard
            trackTitle={recommendations.tracks[0].name}
            trackArtist={recommendations.tracks[0].artists[0].name}
            image={recommendations.tracks[0].album.images[0].url}
          />
        )}
        <div className="flex justify-center items-center mt-10">
          {/* <div
            role="button"
            className="hover:bg-slate-600 rounded-full me-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon size={1} path={mdiReplay} color="white" />
          </div>
          <div
            role="button"
            className="hover:bg-purple-500 rounded-full bg-purple-400 w-16 h-16 flex items-center justify-center"
          >
            <Icon path={mdiPlay} color="white" size={1.8} />
          </div>
          <div
            role="button"
            className="hover:bg-slate-600 rounded-full ms-4 bg-slate-500 w-11 h-11 flex items-center justify-center"
          >
            <Icon path={mdiSync} size={1} color="white" />
          </div> */}
          <Player accessToken={accessToken} trackUri={playingTrack} />
          {/* <PreBuiltPlayer accessToken={accessToken} trackUri={playingTrack} /> */}
        </div>
      </div>
    </>
  );
}
