import {
  mdiAccount,
  mdiChat,
  mdiChatOutline,
  mdiClose,
  mdiDelete,
  mdiDotsHorizontal,
  mdiHomeOutline,
  mdiPencilPlusOutline,
  mdiPlus,
} from "@mdi/js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SpotifyWebApi from "spotify-web-api-node";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login.jsx";
import { musicPostsService } from "../services/MusicPostsService.js";
import MusicPlayerCard from "../components/MusicPlayerCard.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommentForm from "../components/CommentForm.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppState } from "../AppState.js";
import useGenerateRandomColor from "../models/TailwindColor.js";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { commentsService } from "../services/CommentsService.js";
import useAuth from "../services/useAuth.js";
import SpotifyLogin from "../components/ui/SpotifyLogin.jsx";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

const formSchema = z.object({
  comment: z
    .string()
    .min(5, {
      message: "Message must be at least 5 characters.",
    })
    .max(500),
  postId: z.string(),
});

export default function PostsPage() {
  const [musicPosts, setMusicPosts] = useState([]);
  const { color, generateColor } = useGenerateRandomColor();
  const [focusedPostId, setFocusedPostId] = useState("");
  const code = new URLSearchParams(window.location.search).get("code");

  // const accessToken = useAuth(code);

  useEffect(() => {
    generateColor();
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    const musicPosts = await musicPostsService.getAllPosts();
    setMusicPosts(musicPosts);
  };

  const deletePost = async (musicPostId) => {
    try {
      await musicPostsService.deletePost(musicPostId);
    } catch (error) {
      toast.error("Error Deleting Post");
    }
  };

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <>
      <div className="">
        <div className="flex justify-center my-4">
          <span className="text-3xl">Explore Posts</span>
        </div>
      </div>
      <section className="sm:flex sm:flex-col mb-10 sm:items-center ">
        {musicPosts.map((post, index) => (
          <Card
            key={post.id}
            className={`mx-4` + " " + `text-light sm:w-3/4 mb-4`}
            style={{ backgroundColor: "#" + color }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="flex items-center me-2">
                    {post.creator.picture ? (
                      <img
                        src={post.creator.picture}
                        className="rounded-full"
                        style={{ height: 30 }}
                      />
                    ) : (
                      <Avatar>
                        <AvatarImage src={post.creator.picture} />
                        <AvatarFallback>
                          <Icon path={mdiAccount} color="black" size={1} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span>{post.creator.name}</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger>
                      <Icon
                        title="Open Options Menu"
                        path={mdiDotsHorizontal}
                        size={1.4}
                        color="white"
                        className="cursor-pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent className={"w-36 flex justify-center"}>
                      {AppState.account?.id == post.creator.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant={"destructive"} className="w-full">
                              <Icon path={mdiDelete} color="black" size={1} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className={"bg-slate-900"}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className={
                                  "hover:bg-accent hover:text-accent-foreground bg-transparent border-none"
                                }
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className={
                                  "bg-destructive hover:bg-destructive/80"
                                }
                                onClick={() => {
                                  deletePost(post.id);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-center">
                <span className="text-xl">{post.textComment}</span>
              </div>
            </CardHeader>
            <CardContent>
              {post.trackIds.length > 0 && (
                <MusicPlayerCard
                  // accessToken={accessToken}
                  trackIds={post.trackIds}
                />
              )}
              {post.picture && (
                <img src={post.picture} className="rounded-sm" />
              )}
            </CardContent>
            <CardFooter>
              <div className="flex">
                <Drawer>
                  <DrawerTrigger
                    onClick={() => {
                      setFocusedPostId(post.id);
                    }}
                  >
                    <Icon path={mdiChatOutline} color="white" size={1} />
                  </DrawerTrigger>
                  <DrawerContent className={"h-4/6 bg-slate-800"}>
                    <div className="flex justify-end">
                      <DrawerClose>
                        <Icon
                          className="me-4"
                          path={mdiClose}
                          color="white"
                          size={1}
                        />
                      </DrawerClose>
                    </div>
                    <DrawerTitle className="text-center my-4 text-2xl">
                      Comments
                    </DrawerTitle>
                    <DrawerFooter>
                      <CommentForm postId={focusedPostId} />
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </CardFooter>
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
