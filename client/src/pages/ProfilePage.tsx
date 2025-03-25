import {
  mdiAccount,
  mdiChatOutline,
  mdiClose,
  mdiDelete,
  mdiDeleteOutline,
  mdiDotsHorizontal,
  mdiFlagOutline,
  mdiHeartOutline,
  mdiHomeOutline,
  mdiLoading,
  mdiPencilPlusOutline,
} from "@mdi/js";
import React, { useEffect, useState } from "react";
import { AppState } from "../AppState.js";
import Icon from "@mdi/react";
import { Link, useParams } from "react-router-dom";
import Login from "../components/Login.jsx";
import { profilesService } from "../services/ProfilesService.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MusicPlayerCard from "../components/MusicPlayerCard.jsx";
import { Button } from "@/components/ui/button";
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
import ReportPostForm from "../components/ReportPostForm.tsx";
import ReportCommentForm from "../components/ReportCommentForm.tsx";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { commentsService } from "../services/CommentsService.js";
import useCommentForm from "../components/CommentForm.tsx";
import DisabledCommentForm from "../components/DisabledCommentForm.jsx";
import { musicPostsService } from "../services/MusicPostsService.js";
import { Separator } from "@/components/ui/separator";
import { Account } from "../models/Account.js";



interface PostComment {
  body: string;
  creator: {
    name: string;
    id: string;
    picture: string;
  }
  creatorId: number;
  musicPostId: number;
  fromNow: string;
  id: string;
}

interface MusicPost {
  id: string;
  textComment: string;
  picture: string;
  trackIds: string[];
  creator: {
    name: string;
    id: string;
    picture: string;
  };
  fromNow: string;
  color: string;
}

interface Account {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export default function ProfilePage() {
  const params = useParams();
  const [activeProfile, setActiveProfile] = useState<Account>({id: "", email: "", name: "", picture: ""});
  const [activeProfilePosts, setActiveProfilePosts] = useState<MusicPost[]>([]);
  const [focusedPostId, setFocusedPostId] = useState("");
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [accountSet, setAccountSet] = useState(false);
  const [account, setAccount] = useState<Account>({id: "", email: "", name: "", picture: ""});
  const { render, comment } = useCommentForm();
  const [reportPostFormOpen, setReportPostFormOpen] = useState(false);
  const [reportCommentFormOpen, setReportCommentFormOpen] = useState(false);
  const [extraCommentOptionsDrawerOpen, setExtraCommentOptionsDrawerOpen] =
    useState(false);
  const [extraOptionsPopoverOpen, setExtraOptionsPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zeroComments, setZeroComments] = useState(false);
  console.log(activeProfile)
  useEffect(() => {
    if (!AppState.account?.id) return;
    setAccount(AppState.account);
  }, [accountSet]);

  async function getProfileById() {
    const profile = await profilesService.getProfileById(params.profileId);
    setActiveProfile(profile);
  }

  async function getProfilePosts() {
    const profilePosts = await profilesService.getProfilePosts(
      params.profileId
    );
    console.log(profilePosts);
    setActiveProfilePosts(profilePosts);
  }

  useEffect(() => {
    getProfileById();
    getProfilePosts();
  }, []);

  const handleCount = () => {
    setReportPostFormOpen(!reportPostFormOpen);
  };
  const handleCount2 = () => {
    setReportCommentFormOpen(!reportCommentFormOpen);
  };
  const handleCount3 = () => {
    setExtraCommentOptionsDrawerOpen(!extraCommentOptionsDrawerOpen);
  };
  const handleCount4 = () => {
    setExtraOptionsPopoverOpen(!extraOptionsPopoverOpen);
  };

  useEffect(() => {
    if (!comment.creator) return;
    setPostComments((comments) => [...comments, comment]);
  }, [comment]);

  const deletePost = async (musicPostId) => {
    try {
      await musicPostsService.deletePost(musicPostId);
      const foundMusicPost = activeProfilePosts.find(
        (post) => post.id == musicPostId
      );
      if (foundMusicPost) {
        const updatedPosts = activeProfilePosts.filter(
          (post) => post.id !== musicPostId
        );
        setActiveProfilePosts(updatedPosts);
      }
    } catch (error) {
      toast.error("Error Deleting Post");
    }
  };

  const getPostComments = async (postId) => {
    try {
      const postComments = await commentsService.getAllComments(postId);

      console.log(postComments);
      setLoading(false);
      setTimeout(() => {
        setPostComments(postComments);
      }, 500);
      if (postComments.length == 0) {
        setZeroComments(true);
      }
    } catch (error) {
      toast.error("Error getting comments.");
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
        if (unDeletedComments.length === 0) setZeroComments(true);
      }
      setExtraCommentOptionsDrawerOpen(false);
    } catch (error) {
      toast.error("Error deleting comments.");
    }
  };
  return (
    <>
      <div className="h-screen">
        <div className="h-[95%] flex flex-col justify-between">
          {activeProfile.name !== "" && (
            <div className="p-5 text-center flex flex-col justify-center items-center gap-y-4">
              <Avatar className={"h-40 w-40 static"}>
                <AvatarImage className="" src={activeProfile.picture} />
                <AvatarFallback>
                  <Icon path={mdiAccount} color="black" size={4} />
                </AvatarFallback>
              </Avatar>
              <p className="text-2xl my-1 font-bold ">{activeProfile.name}</p>
            </div>
          )}
          <div className="flex flex-col justify-center items-center text-lg">
            <span className="text-slate-200">{activeProfilePosts.length != 0 && activeProfilePosts.length}</span>
            <span className="text-slate-300">Posts</span>
          </div>
          <Separator className={"my-4"} />
          <section className="sm:flex sm:flex-col sm:items-center ">
            {activeProfilePosts.map((post) => (
              <Card
                key={post.id}
                className={`mx-4` + " " + `text-light sm:w-3/4 mb-4`}
                style={{ backgroundColor: post.color }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <Link to={`/profiles/${post.creator.id}`}>
                        <div className="flex items-center me-2">
                          <Avatar>
                            <AvatarImage src={post.creator.picture} />
                            <AvatarFallback>
                              <Icon path={mdiAccount} color="black" size={1} />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </Link>
                      <div className="flex flex-col">
                        <span>{post.creator.name}</span>
                        <span>{post.fromNow}</span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setAccountSet(!accountSet);
                      }}
                    >
                      {account.id !== "" ? (
                        <Popover>
                          <PopoverTrigger
                            asChild
                            onClick={() => {
                              setAccountSet(!accountSet);
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
                          <PopoverContent
                            className={
                              "w-36 flex flex-col bg-slate-800 border-none justify-center"
                            }
                          >
                            {activeProfile?.id == post.creator.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant={"destructive"}
                                    className="w-full mb-2 focus-within:ring-0 focus-visible:ring-0"
                                  >
                                    <Icon
                                      path={mdiDelete}
                                      color="black"
                                      size={1}
                                    />
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
                            <Dialog
                              open={reportPostFormOpen}
                              onOpenChange={setReportPostFormOpen}
                            >
                              <DialogTrigger asChild>
                                <Button variant={"secondary"}>
                                  <span>Report Post</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                className={"bg-slate-800 rounded-sm w-5/6"}
                              >
                                <DialogTitle>Report Post</DialogTitle>
                                <DialogDescription>
                                  Provide details of this report.
                                </DialogDescription>
                                <ReportPostForm
                                  postCreatorPicture={post.creator.picture}
                                  postId={post.id}
                                  handler={handleCount}
                                  handler2={handleCount4}
                                  postCreator={post.creator.name}
                                />
                              </DialogContent>
                            </Dialog>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div>
                          <Icon
                            path={mdiDotsHorizontal}
                            size={1.4}
                            color="white"
                            className="cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-xl">{post.textComment}</span>
                  </div>
                </CardHeader>
                {post.trackIds.length > 0 || post.picture ? (
                  <CardContent>
                    {post.trackIds.length > 0 && (
                      <MusicPlayerCard
                        // accessToken={accessToken}
                        trackIds={post.trackIds}
                      />
                    )}
                    {post.picture && (
                      <div className="w-full flex justify-center">
                        <img
                          src={post.picture}
                          className="rounded-sm "
                          style={{ maxHeight: 400 }}
                        />
                      </div>
                    )}
                  </CardContent>
                ) : (
                  <div></div>
                )}
                <CardFooter>
                  <div className="flex justify-between w-full">
                    <Drawer>
                      <DrawerTrigger
                        onClick={() => {
                          setLoading(true);
                          setZeroComments(false);
                          setPostComments([]);
                          setFocusedPostId(post.id);
                          getPostComments(post.id);
                          setAccountSet(!accountSet);
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
                        {zeroComments && (
                          <div className="flex flex-grow h-full justify-center items-center mt-3.5">
                            <span>No comments yet... Be the first!</span>
                          </div>
                        )}
                        {loading && (
                          <div className="flex flex-grow h-full justify-center items-center mt-3.5">
                            <Icon path={mdiLoading} spin size={2} />
                          </div>
                        )}
                        {postComments.length !== 0 && (
                          <>
                            <div className="flex flex-col flex-grow">
                              {postComments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="flex mx-5 mt-4"
                                >
                                  <div className="flex me-2">
                                    <Avatar className={"sm:h-8 sm:w-8 static"}>
                                      <AvatarImage
                                        src={comment.creator.picture}
                                      />
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
                                        <Drawer
                                          open={extraCommentOptionsDrawerOpen}
                                          onOpenChange={
                                            setExtraCommentOptionsDrawerOpen
                                          }
                                        >
                                          <DrawerTrigger>
                                            <Icon
                                              path={mdiDotsHorizontal}
                                              color="white"
                                              size={1}
                                            />
                                          </DrawerTrigger>
                                          <DrawerContent
                                            className={"bg-primary"}
                                          >
                                            <div className="grid grid-cols-3 mt-3">
                                              <div className="col-span-1"></div>
                                              <div className="col-span-1 flex justify-center">
                                                <DrawerTitle>
                                                  More Options
                                                </DrawerTitle>
                                                <DrawerDescription></DrawerDescription>
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
                                            <Dialog
                                              open={reportCommentFormOpen}
                                              onOpenChange={
                                                setReportCommentFormOpen
                                              }
                                            >
                                              <DialogTrigger asChild>
                                                <div className="flex cursor-pointer mx-5 mb-5">
                                                  <div>
                                                    <Icon
                                                      path={mdiFlagOutline}
                                                      color="white"
                                                      size={1}
                                                    />
                                                  </div>
                                                  <div className="ms-2">
                                                    <span className="hover:text-slate-400 delay-75 ease-in-out transition-all">
                                                      Report
                                                    </span>
                                                  </div>
                                                </div>
                                              </DialogTrigger>
                                              <DialogContent
                                                className={
                                                  "bg-slate-800 rounded-sm w-5/6"
                                                }
                                              >
                                                <DialogTitle>
                                                  Report Comment
                                                </DialogTitle>
                                                <DialogDescription>
                                                  Provide details of this
                                                  report.
                                                </DialogDescription>
                                                <ReportCommentForm
                                                  handler={handleCount2}
                                                  handler2={handleCount3}
                                                  commentId={comment.id}
                                                  commentCreatorName={
                                                    comment.creator.name
                                                  }
                                                />
                                              </DialogContent>
                                            </Dialog>

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
                                                      <span className="text-destructive hover:text-red-700 transition-all ease-in-out delay-75">
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
                                                      This action cannot be
                                                      undone.
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
                                                        deleteComment(
                                                          comment.id
                                                        );
                                                        // setTimeout(() => {
                                                        //   getPostComments(post.id);
                                                        // }, 500);
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
                        {account.id ? (
                          <div>
                            {postComments.length <= 6 ? (
                              <DrawerFooter
                                className={"fixed bg-primary bottom-0 w-full"}
                              >
                                {render({
                                  postId: focusedPostId,
                                  setZeroComments,
                                })}
                              </DrawerFooter>
                            ) : (
                              <DrawerFooter
                                className={"sticky bg-primary bottom-0 w-full"}
                              >
                                {render({
                                  postId: focusedPostId,
                                  setZeroComments,
                                })}
                              </DrawerFooter>
                            )}
                          </div>
                        ) : (
                          <div>
                            {postComments.length <= 6 ? (
                              <DrawerFooter
                                className={"fixed bg-primary bottom-0 w-full"}
                              >
                                <DisabledCommentForm />
                              </DrawerFooter>
                            ) : (
                              <DrawerFooter
                                className={"sticky bg-primary bottom-0 w-full"}
                              >
                                <DisabledCommentForm />
                              </DrawerFooter>
                            )}
                          </div>
                        )}
                      </DrawerContent>
                    </Drawer>
                    <div className="flex">
                    <Icon path={mdiHeartOutline} color={"white"} size={1}/>
                      <span className="text-white ps-1">2</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </section>
          <div className="p-5 flex justify-center"></div>
          <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
            <Link to={`/listen`}>
              <div className="cursor-pointer">
                <Icon path={mdiHomeOutline} color="white" size={1} />
              </div>
            </Link>
            <Link to={"/posts"}>
              <div className="cursor-pointer">
                <Icon path={mdiChatOutline} color="white" size={1} />
              </div>
            </Link>
            <Link to={"/create"}>
              <div className="cursor-pointer">
                <Icon path={mdiPencilPlusOutline} color="white" size={1} />
              </div>
            </Link>
            <Login profilePic={""} />
          </div>
        </div>
      </div>
    </>
  );
}
