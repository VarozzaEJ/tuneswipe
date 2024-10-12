import { mdiChat, mdiHomeOutline, mdiPencilPlusOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login.jsx";
import { musicPostsService } from "../services/MusicPostsService.js";
import MusicPlayerCard from "../components/MusicPlayerCard.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppState } from "../AppState.js";
import useGenerateRandomColor from "../models/TailwindColor.js";

export default function PostsPage() {
  const [musicPosts, setMusicPosts] = useState([]);
  const { color, generateColor } = useGenerateRandomColor();

  useEffect(() => {
    generateColor();
    getAllPosts();
  }, []);
  const getAllPosts = async () => {
    const musicPosts = await musicPostsService.getAllPosts();
    setMusicPosts(musicPosts);
  };

  return (
    <>
      <div className="flex justify-center my-4">
        <span className="text-3xl">Explore Posts</span>
      </div>
      <section>
        {musicPosts.map((post, index) => (
          <Card
            key={post.id}
            className={`mx-4` + " " + `bg-[#${color}/75] text-light`}
            style={{ backgroundColor: "#" + color }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="flex items-center me-2">
                    <img
                      src={post.creator.picture}
                      className="rounded-full"
                      style={{ height: 30 }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>{post.creator.name}</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MusicPlayerCard trackIds={post.trackIds} />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </section>
      <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
        <Link to={"/"}>
          <div className="cursor-pointer">
            <Icon path={mdiHomeOutline} color="white" size={1} />
          </div>
        </Link>
        <div className="cursor-pointer">
          <Icon path={mdiChat} color="white" size={1} />
        </div>
        <Link to={"/create"}>
          <div className="cursor-pointer">
            <Icon path={mdiPencilPlusOutline} color="white" size={1} />
          </div>
        </Link>
        <Login />
      </div>
    </>
  );
}
