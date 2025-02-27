import {
  mdiArrowRight,
  mdiChatOutline,
  mdiHomeOutline,
  mdiImage,
  mdiLoading,
  mdiMagnify,
  mdiMusicNote,
  mdiPalette,
  mdiPencilPlus,
} from "@mdi/js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import {accountService} from "../services/accountService.js"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Login from "../components/Login.jsx";
import SpotifyWebApi from "spotify-web-api-node";
import { toast } from "sonner";
import TopTrackCard from "@/components/TopTrackCard.js";
import { musicPostsService } from "../services/MusicPostsService";
import { useNavigate } from "react-router-dom";
import AddedTopTrackCard from "@/components/AddedTopTrackCard.js";
import { AuthService } from "../services/AuthService.js";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});

type FormData = {
  textComment: string;
  trackIds: string[];
  // picture: string;
  color: string;
  file: null;
}

const MAX_FILE_SIZE = 2000000
    const ACCEPTED_IMAGE_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ]

const imageSchema = z.any().optional()
// .refine(file => file.length == 1 ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) ? true : false : true, 'Invalid file. choose either JPEG or PNG image')
// .refine(file => file.length == 1 ? file[0]?.size <= MAX_FILE_SIZE ? true : false : true, 'Max file size allowed is 8MB.')

const formSchema : ZodType<FormData> = z.object({
  textComment: z.string().min(5, {
    message: "Message must be at least 5 characters.",
  }).max(500),
  trackIds: z.array(z.string()).optional(),
  // picture: z.string().min(25, {
  //   message: "Picture must be at least 25 characters.",
  // }).max(1000, {
  //   message: "Character limit must not exceed 1000"
  // }).optional(),
  color: z.string({message: "Color is required"}).min(2, {
    message: "Color is required"
  }),
  file: imageSchema,
});

export default function CreatePage() {
  const [accountId, setAccountId] = useState("")
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
  const [colorString, setColorString] = useState("")
  const [userName, setUserName] = useState("")
  const [currentUsersPlaylists, setCurrentUsersPlaylists] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    //TODO make this happen in a higher component to skip the login process if the token already exists or has not expired
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
    checkUser()
  }, []);
  
  const checkUser = async () => {
    const user = await accountService.getAccount()
    if(user == null || undefined) {
      AuthService.loginWithPopup()
    }
  }

  useEffect(() => {
    if (!accessToken) return;
    //TODO if no access token found or if access token is expired, refressh the john
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe()
  .then(function(data) {
    console.log(data.body)
    setUserName(data.body.id)
  }, function(err) {
    console.log('Something went wrong!', err);
    if(err.message.includes("expired")) {
      setIsExpired(true);
      setExpiredTokenDialogOpen(true)
    }
  });
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

  const getUsersPlaylists = async () => {
    await spotifyApi.getUserPlaylists(`${userName}`)
  .then(function(data) {
    console.log('Retrieved playlists', data.body);
    setCurrentUsersPlaylists(data.body.items)
  },function(err) {
    console.log('Something went wrong!', err);
  });
  }

  //TODO make only tracks possible or pictures. A user shouldn't be able to use both in the same form submission
  const {register, handleSubmit, getValues, setValue, formState: {errors}, resetField} = useForm<FormData>({resolver: zodResolver(formSchema)})

  const submitForm = async (data: FormData) => {
    setSubmitting(true)
    if(data.file) {
      const fileUrl = await musicPostsService.getFileUrl(data.file[0])
      console.log('🌆', fileUrl)
      data.file = fileUrl
    } 
    
    if(!isUsingPicture) {
      data.trackIds = chosenSongIds
    }
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
  function closeDialog() {
    setOpen(false)
  }
// const pictureValue = getValues().picture

  // useEffect(() => {
  //   // checkPictureValue()
  //   setPictureString(pictureValue)
  // }, [pictureValue])

  

  // const checkPictureValue = () => {
  //   const formDataValues = getValues()
  //   if(formDataValues.picture !== undefined) setIsUsingPicture(true)
  //   if(formDataValues.picture === undefined) setIsUsingPicture(false)
  // }

  async function selectFile(event) {
  try {
    const file = event.target.files[0]
    console.log(file)
    setPictureString(URL.createObjectURL(file)) 
    setIsUsingPicture(true)
  }
  catch (error) {
    console.error(error)
  }
}

  const getTracksInPlaylist = async (playlistId) => {
    await spotifyApi.getPlaylistTracks(`${playlistId}`, {
    fields: 'items'
  })
  .then(
    function(data) {
      console.log('The playlist contains these tracks', data.body.items);
      setPlaylistTracks(data.body.items)
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
  }

  console.log(pictureString)

  useEffect(() => {
    if (!search) return setSearchResults([]);

    let cancel = false;
    spotifyApi.searchTracks(search, { limit: 6 }).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items
      );
    });
    return () => (cancel = true);
  }, [search]);
  
  function checkIfSongAlreadyAdded() {
    chosenSongCards.map((song) => {
      const alreadyFound = likedSongs.find(likedSong => likedSong.id == song.id)
      console.log('💘',alreadyFound)
    })
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
                ></textarea>
                <span >{commentString.length}/500</span>
                {pictureString?.length > 20 && 
                <div style={{maxHeight: 400}} className="flex w-full justify-center">

                <img src={pictureString} alt="Your chosen picture" style={{width: 400, maxHeight: 400}} className="mt-3" />
                </div>
              }
              {chosenSongCards.length !== 0 && 
              chosenSongCards.map(song => (
                <div key={song.id} onClick={() => {addSongId(song.id)}} className="mt-3">
                <AddedTopTrackCard  song={song} />
                </div>
              ))
              }
              {colorString.length !== 0 && 
              
                <div className="flex">
                  <div className="flex items-center me-2">
                    <span>
                      Your chosen color:
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-sm`} style={{backgroundColor: colorString}}>

                  </div>
                </div>
            }
                
              {errors.color && <div>
                <span className="text-destructive">
                {errors.color.message}
                </span>
                </div>
                }
              {commentString.length >= 1 && commentString.length < 5 ? <div><span className="text-destructive">Message must be five characters or greater.</span></div> : null}
              </div>
                <div>
                  <div className="flex justify-center">
            {submitting ? <Button className="w-1/4 border cursor-default hover:bg-slate-50 border-white mb-2" variant={"secondary"}>
              <Icon path ={mdiLoading} spin color={"black"} size={1.5}/>
            </Button> :
            <Button type="submit" variant={"ghost"} className={`w-1/4 border border-white mb-2`}>
                Submit
            </Button>
            }
                  </div>
          <div className="grid grid-cols-3 mb-10 justify-items-center">
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
      <AlertDialogContent className="bg-slate-800 w-5/6 rounded-sm">
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
              // resetField("picture")
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
                    checkIfSongAlreadyAdded()
                    getUsersPlaylists()
                    }} className="">
                    <div className="text-slate-400 hover:text-slate-300 transition-all ease-in-out">
                      <Icon path={mdiMusicNote} color="white" size={1} />
                      <span className="  mt-1">Mix</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 music-drawer h-5/6 overflow-y-scroll ">
                    <Tabs defaultValue="Top Tracks">
                      <div className="mx-5">

                      <TabsList className="grid w-full grid-cols-3 mt-3 bg-inherit text-secondary">
                        <TabsTrigger value="Top Tracks">Top Tracks</TabsTrigger>
                        <TabsTrigger value="Playlists">Playlists</TabsTrigger>
                        <TabsTrigger value="Search Songs">Search Songs</TabsTrigger>
                      </TabsList>
                      <Separator className="my-4"/>
                      </div>
                      <TabsContent value="Top Tracks">
                        <DrawerTitle className="text-center text-3xl mb-3"></DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                        {musicCardsReady ? <div className="flex-col flex mx-5">
                        {likedSongs.map((song, index) => (
                          <div onClick={() => {
                            addSongId(song.id, song)
                            setIsUsingMix(true)
                          }} key={song.id}>
                            <TopTrackCard chosenSongCards={chosenSongCards} song={song}/>
                          </div>
                         ))}
                  </div> : <div className="flex flex-col items-center mx-5">
                    <span className="text-center"><Icon path={mdiLoading} spin color={"white"} size={2}/></span>
                    </div>}
                      </TabsContent>
                      <TabsContent value="Playlists">
                         <DrawerTitle className="text-center text-3xl mb-3"></DrawerTitle>
                         <DrawerDescription></DrawerDescription>
                         {currentUsersPlaylists.map(playlist => (
                          <Sheet key={playlist.id}>
                            <SheetTrigger asChild>

                          <div onClick={() => {
                            setPlaylistTracks([])
                            getTracksInPlaylist(playlist.id)
                          }} className="flex cursor-pointer hover:bg-slate-700 transition-all ease-in-out rounded-sm justify-between mb-4 mx-5">
                            
                            <div className="flex">
                              <img className="rounded-sm" src={playlist.images[0].url} style={{width: 64}} alt="" />
                              <span className="flex items-center ms-4">{playlist.name}</span>
                            </div>
                            <div className="flex items-center justify-center">
                              <Icon path={mdiArrowRight} color={"white"} size={1}/>
                            </div>
                          </div>
                            </SheetTrigger>
                            <SheetContent className="bg-slate-800 w-screen border-none overflow-y-scroll">
                              <SheetHeader>
                                <SheetTitle className="text-slate-200">
                                  {playlist.name}
                                </SheetTitle>
                                <SheetDescription></SheetDescription>
                              </SheetHeader>
                              {playlistTracks.length == 0 ? 
                              <div className="flex flex-col items-center mx-5">
                                <span className="text-center">
                                    <Icon path={mdiLoading} spin color={"white"} size={2}/>
                                </span>
                              </div> 
                    : 
                              <div>
                              {playlistTracks.map(track => (
                                <div onClick={() => {
                                    addSongId(track.track.id, track.track)
                                    setIsUsingMix(true)
                                }} key={track.track.id}>
                                    <TopTrackCard chosenSongCards={chosenSongCards}  song={track.track} />
                                </div>
                              ))}
                              </div>
                            }
                            </SheetContent>
                          </Sheet>
                         ))}
                      </TabsContent>
                      <TabsContent value="Search Songs">
                         <DrawerTitle className="text-center text-3xl mb-3"></DrawerTitle>
                         <DrawerDescription></DrawerDescription>
                         <div className="sticky top-0 mx-5 flex">
                          <Input 
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="text-black" placeholder="Search by artist name..." />
                          <Button className="ms-1"><Icon path={mdiMagnify} color={"white"} size={1}/></Button>
                         </div>
                         {searchResults.length == 0 ? 
                         <div className="flex flex-col items-center mx-5 mt-4">
                                <span className="text-center">
                                    <Icon path={mdiLoading} spin color={"white"} size={2}/>
                                </span>
                        </div> 
                              :
                         <div>
                          {searchResults.map(track => (
                            <div onClick={() => {
                                    addSongId(track.id, track)
                                    setIsUsingMix(true)
                                }} key={track.id} className="mx-5 mt-4" >

                            <TopTrackCard chosenSongCards={chosenSongCards} song={track}/>
                            </div>
                          ))}
                         </div>
                        }
                      </TabsContent>
                    </Tabs>
                  
                  
                </DrawerContent>
              </Drawer>
}
            </div>
            <div className="col-span-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="">
                    <div className="flex flex-col text-slate-400 hover:text-slate-300 transition-all ease-in-out justify-center items-center">
                      
                      {errors.color ? 
                      <>
                      <Icon path={mdiPalette} color="red" size={1} />  <span className="text-destructive mt-1">Color</span> 
                      </>
                      : <>
                      <Icon path={mdiPalette} color="white" size={1} /> <span className=" mt-1">Color</span>
                      </>
                      }
                     
                    </div>
                  </Button>
                </DialogTrigger>
                
                  <DialogDescription></DialogDescription>
                  <DialogTitle></DialogTitle>
                <DialogContent className="bg-slate-800 rounded-sm w-40">
                  <div className="p-3 flex justify-center">
                  <Input onInput={(e) => {
                    setColorString(e.target.value)}} className="w-10 p-0 cursor-pointer" {...register("color")} type="color" />
                  </div>
                  <DialogClose asChild>
                  <div className="w-full flex justify-center">
                    <Button onClick={() => {
                      setColorString(getValues("color"))
                    }}>Save</Button>
                  </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
            <div className="col-span-1">
              {chosenSongCards.length !== 0 ? <AlertDialog>
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
              setChosenSongCards([])
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
                <DialogContent onPointerDownOutside={() => {
                  console.log("Working")
                  // checkPictureValue()
                }} className="sm:max-w-md w-5/6 bg-slate-800 rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Upload Photo</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center ">
                    <div className="d-flex justify-content-center">
                      {pictureString.length > 15 ? 
                      <img className="rounded-lg h-56 w-56" src={pictureString}/>
                      : 
                      <div className="bg-subtle rounded-lg h-52 w-52 flex justify-center items-center">
                        <Icon path={mdiImage} color="white" />
                      </div> 
                      }
                    </div>
                    <div className="flex items-center w-full mt-5">
                      <div className="grid flex-1 gap-2">
                        <Input
                          {...register("file")}
                          //FIXME
                          onChange={(e) => {
                            selectFile(e)
                          }}
                          accept="image/*"
                          type="file"
                          className="bg-slate-800 file:text-slate-200 hover:border-slate-400 file:bg-slate-600 file:rounded-sm file:cursor-pointer delay-75 transition-all ease-in-out cursor-pointer"
                        />
                      </div>
                      <div className="ms-1">
                        <Button onClick={() => {
                          closeDialog()
                          // checkPictureValue()
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
        <div className="cursor-pointer">
          <Icon path={mdiPencilPlus} color="white" size={1} />
        </div>
        <Login />
      </div>
    </>
  );
}

