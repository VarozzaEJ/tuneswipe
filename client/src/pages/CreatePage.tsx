import {
  mdiChatOutline,
  mdiCheckCircle,
  mdiHomeOutline,
  mdiImage,
  mdiLoading,
  mdiMusicNote,
  mdiPencilPlus,
  mdiPlus,
  mdiSpotify,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExpiredTokenDialog from "../components/ExpiredTokenDialog"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Login from "../components/Login.jsx";
import SpotifyWebApi from "spotify-web-api-node";
import { toast } from "sonner";
import TopTrackCard from "@/components/TopTrackCard.js";
import { musicPostsService } from "../services/MusicPostsService";
import { useNavigate } from "react-router-dom";
import AddedTopTrackCard from "@/components/AddedTopTrackCard.js";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

type FormData = {
  textComment: string;
  trackIds: string[];
  picture: string;
}

const formSchema : ZodType<FormData> = z.object({
  textComment: z.string().min(5, {
    message: "Message must be at least 5 characters.",
  }).max(500),
  trackIds: z.array(z.string()).optional(),
  picture: z.string().min(25, {
    message: "Picture must be at least 25 characters.",
  }).max(1000, {
    message: "Character limit must not exceed 1000"
  }).optional(),
});

export default function CreatePage() {
  const [accessToken, setAccessToken] = useState("");
  const [musicCardsReady, setMusicCardsReady] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [chosenSongIds, setChosenSongIds] = useState([])
  const [chosenSongCards, setChosenSongCards] = useState([])
  const [open, setOpen] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [expiredTokenDialogOpen, setExpiredTokenDialogOpen] = useState(false)
  const [isUsingMix, setIsUsingMix] = useState(false)
  const [isUsingPicture, setIsUsingPicture] = useState(false)
  const [pictureString, setPictureString] = useState("")
  const [commentString, setCommentString] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const getUsersLikedSongs = async () => {
    await spotifyApi.getMyTopTracks().then(
      function (data) {
        const topTracks = data.body.items;
        setLikedSongs(topTracks);
        setMusicCardsReady(true)
      },
      function (err) {
        console.log("Something went wrong!", err);
        const isExpired = err.message.includes("expired");
          if (isExpired) {
            setIsExpired(true);
            setExpiredTokenDialogOpen(true);
          }
      }
    );
  };

  //TODO make only tracks possible or pictures. A user shouldn't be able to use both in the same form submission
  const {register, handleSubmit, getValues, resetField} = useForm<FormData>({resolver: zodResolver(formSchema)})
  const submitForm = async (data: FormData) => {
    if(!isUsingPicture) {
      data.trackIds = chosenSongIds
    }
    console.log("📊", data)
    await musicPostsService.createPost(data)
    toast.success("Post Created")
    navigate('/posts')
  }

   function addSongId(songId : string, songObject) {
    if(isUsingPicture) {
      toast.error("You can only have one attachment per post")
    }
    const isAdded = chosenSongIds.find((id) => id == songId);
    const foundArtistId = chosenSongIds.findIndex((id) => id == songId);
    if (isAdded) {

      const correctSongIds = chosenSongIds.filter(song => song !== songId);
      setChosenSongIds(correctSongIds)
      const correctSongs = chosenSongCards.filter(song => song.id !== songId)
      setChosenSongCards(correctSongs)
    }
    if (chosenSongIds.length >= 5)
      toast.error("A maximum of 5 artists is allowed");
    if (isAdded || chosenSongIds.length >= 5) return;
    //NOTE maybe throw a pop error of some sort here
    setChosenSongIds((songIds) => [...songIds, songId]);
    setChosenSongCards((song) => [...song, songObject])
  }
console.log(chosenSongCards)
  function closeDialog() {
    setOpen(false)
  }
const pictureValue = getValues().picture

  useEffect(() => {
    checkPictureValue()
    setPictureString(pictureValue)
  }, [pictureValue])

  

  const checkPictureValue = () => {
    const pictureValue = getValues()
    if(pictureValue.picture !== undefined) setIsUsingPicture(true)
    if(pictureValue.picture === undefined) setIsUsingPicture(false)
  }
  return (
    <>
      <div className="container h-full justify-between flex flex-col">
        <div className="flex justify-center text-3xl">
          <span className="my-4">Create post</span>
        </div>
        {isExpired ? <ExpiredTokenDialog open={expiredTokenDialogOpen} /> : 
        <form onSubmit={handleSubmit(submitForm)} className="flex-grow flex flex-col justify-between">
          <div>

              <textarea
                {...register("textComment")}
                onChange={(e) => {
                  setCommentString(e.target.value)
                }}
                className="bg-slate-900 w-full h-20 focus:outline-none"
                placeholder="Share a song or write a note..."
                maxLength={500}
                minLength={5}
                ></textarea>
                <span>{commentString.length}/500</span>
                {pictureString?.length > 10 && 
                <img src={pictureString} alt="Your chosen picture" className="w-full h-1/2 mt-3" />
              }
              {chosenSongCards.length !== 0 && 
              chosenSongCards.map(song => (
                <div key={song.id} className="mt-3">
                <AddedTopTrackCard  song={song} />
                </div>
              ))
              }
              </div>
                <div>
                  <div className="flex justify-center">
            <Button type="submit" variant={"ghost"} className="w-1/4">Submit</Button>
                  </div>
          <div className="grid grid-cols-2 mb-10 justify-items-center">
            <div className="col-span-1">
              {isUsingPicture ? 
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button >
                    <div className="text-slate-400 hover:text-slate-300 transition-all ease-in-out">
                      <Icon path={mdiMusicNote} color="white" size={1} />
                      <span className="mt-1">Mix</span>
                    </div>
                  </Button>
                </AlertDialogTrigger>
      <AlertDialogContent className="bg-primary w-5/6 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>You can only have one attachment per post</AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className="bg-primary">Cancel</Button>
          </AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {
              setIsUsingPicture(false)
              resetField("picture")
            }}
              className={
                "hover:bg-accent hover:text-accent-foreground bg-transparent border-none"
              }
            >
              Clear Photo
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> : 
              <Drawer>
                <DrawerTrigger asChild>
                  <Button onClick={() => {
                    getUsersLikedSongs()
                    }} className="">
                    <div className="text-slate-400 hover:text-slate-300 transition-all ease-in-out">
                      <Icon path={mdiMusicNote} color="white" size={1} />
                      <span className="  mt-1">Mix</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 music-drawer h-5/6 overflow-y-scroll after:top-full after:right-0 after:h-full">
                  <DrawerTitle className="text-center text-3xl mb-3">Top Tracks</DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                  {musicCardsReady ? <div className="flex-col flex mx-5">
                    {likedSongs.map((song, index) => (
                      <div onClick={() => {
                        addSongId(song.id, song)
                        setIsUsingMix(true)
                      }} key={song.id}>
                        <TopTrackCard song={song}/>
                      </div>
                    ))}
                  </div> : <div className="flex flex-col items-center mx-5">
                    <span className="text-center"><Icon path={mdiLoading} spin color={"white"} size={2}/></span>
                    </div>}
                  
                  
                </DrawerContent>
              </Drawer>
}
            </div>
            {/* <div className="col-span-1">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="">
                    <div>
                      <Icon path={mdiPoll} color="white" size={1} />
                      <span className="text-slate-400 mt-1">Poll</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 h-5/6">
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                  <DrawerFooter>
                    <Button>Submit</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div> */}
            <div className="col-span-1">
              {isUsingMix ? <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    <div className="flex flex-col text-slate-400 hover:text-slate-300 transition-all ease-in-out justify-center items-center">
                      <Icon path={mdiImage} color="white" size={1} />
                      <span className="">Photo</span>
                    </div>
                  </Button>
                  </AlertDialogTrigger>
      <AlertDialogContent className="bg-primary w-5/6 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>You can only have one attachment per post</AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className="bg-primary">Cancel</Button>
          </AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {
              setChosenSongIds([])
              setIsUsingMix(false)
            }}
              className={
                "hover:bg-accent hover:text-accent-foreground bg-transparent border-none"
              }
            >
              Clear Songs?
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> : 
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <div className="flex flex-col text-slate-400 hover:text-slate-300 transition-all ease-in-out justify-center items-center">
                      <Icon path={mdiImage} color="white" size={1} />
                      <span className="">Photo</span>
                    </div>
                  </Button>
                  
                </DialogTrigger>
                <DialogContent className="sm:max-w-md w-5/6 bg-slate-800 rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Upload Photo</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center ">
                    <div className="d-flex justify-content-center">
                      {pictureString !== undefined && pictureString?.includes(".") ? 
                      <img className="rounded-lg h-52 w-52" src={pictureString}/>
                      : 
                      <div className="bg-subtle rounded-lg h-52 w-52 flex justify-center items-center">
                        <Icon path={mdiImage} color="white" />
                      </div> 
                      }
                    </div>
                    <div className="flex items-center w-full mt-5">
                      <div className="grid flex-1 gap-2">
                        <Input
                          onClick={() => {
                            setIsUsingPicture(true)
                          }}
                          {...register("picture")}
                          onChange={(e) => {
                            setPictureString(e.target.value)
                          }}
                          id="link"
                          type="url"
                          placeholder="Photo URL"
                          className="bg-slate-800"
                        />
                      </div>
                      <div className="ms-1">
                        <Button onClick={() => {
                          closeDialog()
                          checkPictureValue()
                        }}>Save</Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
}
            </div>
          </div>
                </div>
          
        </form>
}
      </div>
      <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
        <Link to={"/"}>
          <div className="cursor-pointer">
            <Icon path={mdiHomeOutline} color="white" size={1} />
          </div>
        </Link>
        <Link to={"/posts"}>
        <div className="cursor-pointer">
          <Icon path={mdiChatOutline} color="white" size={1} />
        </div>
        </Link>
        <div className="cursor-pointer">
          <Icon path={mdiPencilPlus} color="white" size={1} />
        </div>
        <Login />
      </div>
    </>
  );
}

