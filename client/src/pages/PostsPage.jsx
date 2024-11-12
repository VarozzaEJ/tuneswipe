import {
  mdiAccount,
  mdiChat,
  mdiChatOutline,
  mdiClose,
  mdiDelete,
  mdiDeleteOutline,
  mdiDotsHorizontal,
  mdiFlagOutline,
  mdiHomeOutline,
  mdiLoading,
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
import useCommentForm from "../components/CommentForm.tsx";

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
  const [focusedPostId, setFocusedPostId] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [accountSet, setAccountSet] = useState(false);
  const [account, setAccount] = useState({});
  const { render, comment } = useCommentForm();

  useEffect(() => {
    if (!AppState.account) return;
    setAccount(AppState.account);
  }, [accountSet]);

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    if (!comment.creator) return;
    setPostComments((comments) => [...comments, comment]);
  }, [comment]);

  const getAllPosts = async () => {
    const musicPosts = await musicPostsService.getAllPosts();
    setMusicPosts(musicPosts);
  };

  const deletePost = async (musicPostId) => {
    try {
      await musicPostsService.deletePost(musicPostId);
      const foundMusicPost = musicPosts.find((post) => post.id == musicPostId);
      if (foundMusicPost) {
        const updatedPosts = musicPosts.filter(
          (post) => post.id !== musicPostId
        );
        setMusicPosts(updatedPosts);
      }
    } catch (error) {
      toast.error("Error Deleting Post");
    }
  };

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  const getPostComments = async (postId) => {
    try {
      const postComments = await commentsService.getAllComments(postId);
      console.log(postComments);
      setPostComments(postComments);
    } catch (error) {
      toast.error(error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentsService.deleteComment(commentId);
      const foundComment = postComments.find(
        (comment) => comment.id == commentId
      );
      if (foundComment) {
        const unDeletedComments = postComments.filter(
          (comment) => comment.id !== commentId
        );
        setPostComments(unDeletedComments);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  console.log(accountSet);
  return (
    <>
      <div className="">
        <div className="flex justify-center my-4">
          <span className="text-3xl">Explore Posts</span>
        </div>
      </div>
      <section className="sm:flex sm:flex-col sm:items-center ">
        {musicPosts.map((post, index) => (
          <Card
            key={post.id}
            className={`mx-4` + " " + `text-light sm:w-3/4 mb-4`}
            style={{ backgroundColor: post.color }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="flex items-center me-2">
                    <Avatar>
                      <AvatarImage src={post.creator.picture} />
                      <AvatarFallback>
                        <Icon path={mdiAccount} color="black" size={1} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>{post.creator.name}</span>
                    <span>{post.fromNow}</span>
                  </div>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger
                      onClick={() => {
                        setAccountSet(!accountSet);
                        console.log("working");
                      }}
                    >
                      <Icon
                        title="Open Options Menu"
                        path={mdiDotsHorizontal}
                        size={1.4}
                        color="white"
                        className="cursor-pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent className={"w-36 flex justify-center"}>
                      {account?.id == post.creator.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant={"destructive"} className="w-full">
                              <Icon path={mdiDelete} color="black" size={1} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            className={"bg-slate-900 rounded-sm w-5/6"}
                          >
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
                      setPostComments([]);
                      setFocusedPostId(post.id);
                      getPostComments(post.id);
                    }}
                  >
                    <Icon path={mdiChatOutline} color="white" size={1} />
                  </DrawerTrigger>
                  <DrawerContent
                    className={
                      "h-3/4 bg-slate-800 music-drawer overflow-y-scroll "
                    }
                  >
                    <div className="flex justify-end"></div>
                    <DrawerDescription></DrawerDescription>
                    <div className="grid grid-cols-3 sticky items-center bg-inherit -mt-4 mb-4 top-0 ">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 h-10 ">
                        <DrawerTitle className="text-center text-2xl mt-1">
                          Comments
                        </DrawerTitle>
                      </div>
                      <div className="col-span-1 h-10 flex justify-end items-center">
                        <DrawerClose>
                          <Icon
                            className="me-4"
                            path={mdiClose}
                            color="white"
                            size={1}
                          />
                        </DrawerClose>
                      </div>
                    </div>
                    {postComments.length === 0 ? (
                      <div className="flex flex-grow h-full justify-center items-center mt-3.5">
                        <span>No comments yet... Be the first!</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col flex-grow">
                          {postComments.map((comment) => (
                            <div key={comment.id} className="flex mx-5 mt-4">
                              <div className="flex me-2">
                                <Avatar className={"sm:h-8 sm:w-8 static"}>
                                  <AvatarImage src={comment.creator.picture} />
                                  <AvatarFallback>
                                    <Icon
                                      path={mdiAccount}
                                      color="black"
                                      size={1}
                                    />
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex">
                                  <span className="sm:text-xl">
                                    {comment.creator.name}
                                  </span>
                                  <span className="text-slate-400 ms-2 text-sm sm:text-lg flex items-center mt-px">
                                    {comment.fromNow}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-300 sm:text-lg">
                                    {comment.body}
                                  </span>
                                </div>
                                <div className="flex">
                                  <div>
                                    <Drawer>
                                      <DrawerTrigger>
                                        <Icon
                                          path={mdiDotsHorizontal}
                                          color="white"
                                          size={1}
                                        />
                                      </DrawerTrigger>
                                      <DrawerContent className={"bg-primary"}>
                                        <div className="grid grid-cols-3 mt-3">
                                          <div className="col-span-1"></div>
                                          <div className="col-span-1 flex justify-center">
                                            <DrawerTitle>
                                              More Options
                                            </DrawerTitle>
                                          </div>
                                          <div className="col-span-1 flex justify-end items-center">
                                            <DrawerClose>
                                              <Icon
                                                className="me-4"
                                                path={mdiClose}
                                                color="white"
                                                size={1}
                                              />
                                            </DrawerClose>
                                          </div>
                                        </div>
                                        <div className="flex mx-5 mb-5">
                                          <div>
                                            <Icon
                                              path={mdiFlagOutline}
                                              color="white"
                                              size={1}
                                            />
                                          </div>
                                          <div className="ms-2">
                                            <span>Report</span>
                                          </div>
                                        </div>

                                        {AppState.account?.id ==
                                          comment.creator.id && (
                                          <AlertDialog>
                                            <AlertDialogTrigger>
                                              <div className="flex mx-5 mb-5">
                                                <div>
                                                  <Icon
                                                    path={mdiDeleteOutline}
                                                    color="red"
                                                    size={1}
                                                  />
                                                </div>
                                                <div className="ms-2">
                                                  <span className="text-destructive">
                                                    Delete
                                                  </span>
                                                </div>
                                              </div>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent
                                              className={
                                                "bg-slate-900 w-5/6 rounded-sm"
                                              }
                                            >
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
                                                    deleteComment(comment.id);
                                                  }}
                                                >
                                                  Continue
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        )}
                                      </DrawerContent>
                                    </Drawer>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {postComments.length <= 6 ? (
                      <DrawerFooter
                        className={"fixed bg-primary bottom-0 w-full"}
                      >
                        {render({ postId: focusedPostId })}
                      </DrawerFooter>
                    ) : (
                      <DrawerFooter
                        className={"sticky bg-primary bottom-0 w-full"}
                      >
                        {render({ postId: focusedPostId })}
                      </DrawerFooter>
                    )}
                  </DrawerContent>
                </Drawer>
              </div>
            </CardFooter>
          </Card>
        ))}
      </section>

      {musicPosts.length === 0 ? (
        <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
          <Link to={`/listen/${sessionStorage.getItem("artistIds")}`}>
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
      ) : (
        <div className="grid w-full grid-cols-4 sticky bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
          <Link to={`/listen/${sessionStorage.getItem("artistIds")}`}>
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
      )}
    </>
  );
}
