import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Icon from "@mdi/react";
import {
  mdiChevronRight,
  mdiDotsHorizontal,
  mdiOpenInNew,
  mdiPlusCircleOutline,
  mdiSpotify,
} from "@mdi/js";
import SpotifyWebApi from "spotify-web-api-node";
import { toast } from "sonner";

const spotifyApi = new SpotifyWebApi({
  clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function TrackCard({
  image,
  trackArtist,
  trackTitle,
  accessToken,
  trackId,
  artistLink,
  songLink,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const addSongToYourMusic = async () => {
    try {
      spotifyApi.addToMySavedTracks([`${trackId}`]).then(
        function () {
          console.log("Added track!");
          toast.success("Added Track!");
          setIsOpen(false);
        },
        function (err) {
          toast.error("An error occured");
          console.log("Something went wrong!", err);
        }
      );
    } catch (error) {
      console.log();
    }
  };

  return (
    <>
      <Card className="w-full max-w-md  bg-slate-800 text-white">
        <CardHeader className="px-0 pt-0">
          <img
            draggable="false"
            className="rounded-lg h-52 sm:h-[350px] max-w-full"
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            src={image}
            alt=""
          />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-12 ">
            <div className="sm:col-span-8 col-span-12 prevent-select">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <p className="truncate">{trackTitle}</p>
                </div>
                <div className="col-span-12">
                  <a href={artistLink}>
                    <span className="flex text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out">
                      <Icon path={mdiSpotify} size={1} />
                      <span className="truncate">{trackArtist}</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4 col-span-12 flex justify-end  items-center">
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <span aria-label="Open drawer to see more actions">
                    <Icon
                      title="Open Options Menu"
                      path={mdiDotsHorizontal}
                      size={1.4}
                      color="white"
                      className="cursor-pointer"
                    />
                  </span>
                </DrawerTrigger>
                <DrawerContent
                  aria-label="Options for this song"
                  className="bg-slate-800"
                >
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>

                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                  <div
                    aria-describedby="Options for this song"
                    className="w-full mx-auto flex flex-col p-3"
                  >
                    <div className="flex flex-col justify-center items-center mt-3">
                      <img
                        style={{ height: 150, width: 150 }}
                        src={image}
                        alt={`${trackArtist}'s image'`}
                      />
                      <span>{trackTitle}</span>
                      <a href={artistLink}>
                        <span className="text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out">
                          {trackArtist}
                        </span>
                      </a>
                    </div>
                    <div
                      onClick={() => {
                        addSongToYourMusic();
                      }}
                      className="hover:text-slate-600 delay-75 transition-all ease-in-out flex mb-4 pt-1 cursor-pointer justify-between border border-slate-300 border-e-0 border-t-0 border-s-0"
                    >
                      <span className="flex text-lg ">
                        <Icon
                          path={mdiPlusCircleOutline}
                          color="white"
                          className="me-4"
                          size={1}
                        />
                        Save Song
                      </span>
                      <span>
                        <Icon
                          path={mdiChevronRight}
                          color="white"
                          className=""
                          size={1}
                        />
                      </span>
                    </div>
                    {/* <span
                      onClick={() => {
                        skipToNext();
                        }}
                        className="flex mb-4 text-lg cursor-pointer hover:text-slate-600 ms-2 delay-75 transition-all ease-in-out"
                        >
                        <Icon
                        path={mdiDiameterVariant}
                        color="red"
                        className="me-4"
                        size={1}
                        />
                        Skip this Song
                        </span> */}
                    <a href={songLink}>
                      <div className="hover:text-slate-600 delay-75 transition-all ease-in-out flex pb-1 justify-between cursor-pointer border border-slate-300 border-e-0 border-t-0 border-s-0">
                        <span className="flex text-lg">
                          <Icon
                            path={mdiOpenInNew}
                            color="white"
                            className="me-4"
                            size={1}
                          />
                          Open on Spotify
                        </span>
                        <span>
                          <Icon
                            path={mdiChevronRight}
                            color="white"
                            className=""
                            size={1}
                          />
                        </span>
                      </div>
                    </a>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          {/* <div className="flex flex-wrap md:flex-nowrap justify-between">
            <div className=" block">
              <div className="">
                <p className=" overflow-x-hidden">{trackTitle}</p>
              </div>
              <div>
                <span className="flex text-slate-500">
                  <Icon path={mdiSpotify} size={1} />
                  {trackArtist}
                </span>
              </div>
            </div>
            <div className="flex items-center">
            </div>
          </div> */}
        </CardContent>
      </Card>
    </>
    // <>
    //   <div
    //     id="card"
    //     onMouseMoveCapture={() => {
    //       checkPosition();
    //     }}
    //   >
    //     <Card className="  max-w-md bg-slate-800 text-white">
    //       <CardHeader className="px-0 pt-0 relative">
    //         <img
    //           draggable="false"
    //           className="rounded-lg w-full max-w-full"
    //           style={{
    //             height: 200,
    //             width: 232,
    //             borderBottomLeftRadius: 0,
    //             borderBottomRightRadius: 0,
    //           }}
    //           src={image}
    //           alt=""
    //         />
    //       </CardHeader>
    //       <CardContent className={"p-3 pt-0"}>
    //         <div className="grid gap-4  grid-cols-12 ">
    //           <div className="sm:col-span-8 col-span-12 prevent-select">
    //             <div className="grid grid-cols-12">
    //               <div className="col-span-12">
    //                 <p className="truncate">{trackTitle}</p>
    //               </div>
    //               <div className="col-span-12">
    //                 <a href={artistLink}>
    //                   <span className="flex text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out">
    //                     <Icon path={mdiSpotify} size={1} />
    //                     <span className="truncate ms-1">{trackArtist}</span>
    //                   </span>
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="sm:col-span-4 col-span-12 flex justify-end  items-center">
    //             <Drawer open={isOpen} onOpenChange={setIsOpen}>
    //               <DrawerTrigger>
    //                 <span aria-label="Open drawer to see more actions">
    //                   <Icon
    //                     title="Open Options Menu"
    //                     path={mdiDotsHorizontal}
    //                     size={1.4}
    //                     color="white"
    //                     className="cursor-pointer"
    //                   />
    //                 </span>
    //               </DrawerTrigger>
    //               <DrawerContent
    //                 aria-label="Options for this song"
    //                 className="bg-slate-800"
    //               >
    //                 <div className="flex justify-end me-4">
    //                   <DrawerClose className={""}>
    //                     <Button
    //                       className={"w-16 bg-transparent hover:bg-transparent"}
    //                     >
    //                       <Icon path={mdiClose} color="white" size={1} />
    //                     </Button>
    //                   </DrawerClose>
    //                 </div>
    //                 <DrawerTitle></DrawerTitle>
    //                 <DrawerDescription></DrawerDescription>
    //                 <div
    //                   aria-describedby="Options for this song"
    //                   className="w-full mx-auto flex flex-col "
    //                 >
    //                   <div className="flex flex-col justify-center items-center mt-3">
    //                     <img
    //                       style={{ height: 150, width: 150 }}
    //                       src={image}
    //                       alt={`${trackArtist}'s image'`}
    //                     />
    //                     <span>{trackTitle}</span>
    //                     <a href={artistLink}>
    //                       <span className="text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out">
    //                         {trackArtist}
    //                       </span>
    //                     </a>
    //                   </div>
    //                   <span
    //                     onClick={() => {
    //                       addSongToYourMusic();
    //                     }}
    //                     className="flex my-4 text-lg ms-2 cursor-pointer hover:text-slate-600 delay-75 transition-all ease-in-out"
    //                   >
    //                     <Icon
    //                       path={mdiPlusCircleOutline}
    //                       color="white"
    //                       className="me-4"
    //                       size={1}
    //                     />
    //                     Save Song
    //                   </span>
    //                   {/* <span
    //                   onClick={() => {
    //                     skipToNext();
    //                     }}
    //                     className="flex mb-4 text-lg cursor-pointer hover:text-slate-600 ms-2 delay-75 transition-all ease-in-out"
    //                     >
    //                     <Icon
    //                     path={mdiDiameterVariant}
    //                     color="red"
    //                     className="me-4"
    //                     size={1}
    //                     />
    //                     Skip this Song
    //                     </span> */}
    //                   <a href={artistLink}>
    //                     <span className="flex mb-4 text-lg ms-2 cursor-pointer hover:text-slate-600 delay-75 transition-all ease-in-out">
    //                       <Icon
    //                         path={mdiOpenInNew}
    //                         color="white"
    //                         className="me-4"
    //                         size={1}
    //                       />
    //                       Open on Spotify
    //                     </span>
    //                   </a>
    //                 </div>
    //               </DrawerContent>
    //             </Drawer>
    //           </div>
    //         </div>
    //         {/* <div className="flex flex-wrap md:flex-nowrap justify-between">
    //         <div className=" block">
    //         <div className="">
    //         <p className=" overflow-x-hidden">{trackTitle}</p>
    //         </div>
    //         <div>
    //         <span className="flex text-slate-500">
    //         <Icon path={mdiSpotify} size={1} />
    //         {trackArtist}
    //         </span>
    //         </div>
    //         </div>
    //         <div className="flex items-center">
    //         </div>
    //         </div> */}
    //       </CardContent>
    //     </Card>
    //   </div>
    // </>
  );
}
