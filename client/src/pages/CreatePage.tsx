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
  const [open, setOpen] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [expiredTokenDialogOpen, setExpiredTokenDialogOpen] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    // spotifyApi.setAccessToken(accessToken);
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
        const isExpired = err.message.includes("token");
          if (isExpired) {
            setIsExpired(true);
            setExpiredTokenDialogOpen(true);
          }
      }
    );
  };

  //TODO make only tracks possible or pictures. A user shouldn't be able to use both in the same form submission
  const {register, handleSubmit} = useForm<FormData>({resolver: zodResolver(formSchema)})

  const submitForm = async (data: FormData) => {
    data.trackIds = chosenSongIds
    console.log("📊", data)
    await musicPostsService.createPost(data)
    toast.success("Post Created")
    navigate('/posts')
  }

   function addSongId(songId : string) {
    const isAdded = chosenSongIds.find((id) => id == songId);
    const foundArtistId = chosenSongIds.findIndex((id) => id == songId);
    if (isAdded) {

      chosenSongIds.splice(foundArtistId, 1);
    }
    if (chosenSongIds.length >= 5)
      toast.error("A maximum of 5 artists is allowed");
    if (isAdded || chosenSongIds.length >= 5) return;
    //NOTE maybe throw a pop error of some sort here
    setChosenSongIds((songIds) => [...songIds, songId]);
  }

  function closeDialog() {
    setOpen(false)
  }

  return (
    <>
      <div className="container h-full justify-between flex flex-col">
        <div className="flex justify-center text-3xl">
          <span className="my-4">Create post</span>
        </div>
        {isExpired ? <ExpiredTokenDialog /> : 
        <form onSubmit={handleSubmit(submitForm)} className="flex-grow flex flex-col justify-between">
              <textarea
                {...register("textComment")}
                className="bg-slate-900 w-full h-20 focus:outline-none"
                placeholder="Share a song or write a note..."
                maxLength={500}
                minLength={5}
                ></textarea>
                <div>
                  <div className="flex justify-center">
            <Button type="submit" variant={"ghost"} className="w-1/4">Submit</Button>
                  </div>
          <div className="grid grid-cols-2 mb-10 justify-items-center">
            <div className="col-span-1">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button onClick={getUsersLikedSongs} className="">
                    <div>
                      <Icon path={mdiMusicNote} color="white" size={1} />
                      <span className="text-slate-400 mt-1">Mix</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 music-drawer h-5/6 overflow-y-scroll after:top-full after:right-0 after:h-full">
                  <DrawerTitle className="text-center text-3xl mb-3">Top Tracks</DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                  {musicCardsReady ? <div className="flex-col flex mx-5">
                    {likedSongs.map((song, index) => (
                      <div onClick={() => {
                        addSongId(song.id)
                      }} key={song.id}>
                        <TopTrackCard song={song}/>
                      </div>
                    ))}
                  </div> : <div className="flex flex-col items-center mx-5">
                    <span className="text-center"><Icon path={mdiLoading} spin color={"white"} size={2}/></span>
                    </div>}
                  
                  <DrawerFooter>
                    {/* <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                      </DrawerClose> */}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <div className="flex flex-col justify-center items-center">
                      <Icon path={mdiImage} color="white" size={1} />
                      <span className="text-slate-400">Photo</span>
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
                      <div className="bg-subtle rounded-lg h-52 w-52 flex justify-center items-center">
                        <Icon path={mdiImage} color="white" />
                      </div>
                      {/* <div v-else>
                                    <img className="rounded h-20 w-20" />
                                </div> */}
                    </div>
                    <div className="flex items-center w-full mt-5">
                      <div className="grid flex-1 gap-2">
                        <Input
                          {...register("picture")}
                          id="link"
                          type="url"
                          placeholder="Photo URL"
                          className="bg-slate-800"
                        />
                      </div>
                      <div className="ms-1">
                        <Button onClick={closeDialog}>Save</Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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

