import {
  mdiChatOutline,
  mdiHome,
  mdiHomeOutline,
  mdiImage,
  mdiMusicNote,
  mdiPencilPlus,
  mdiPencilPlusOutline,
  mdiPoll,
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

export default function CreatePage() {
  return (
    <>
      <div className="container h-full justify-between flex flex-col">
        <div className="flex justify-center text-3xl">
          <span className="my-4">Create post</span>
        </div>
        <form className="flex-grow flex flex-col justify-between">
          <textarea
            className="bg-slate-900 w-full h-20 focus:outline-none"
            placeholder="Share a song or write a note..."
            maxLength={500}
            minLength={5}
          ></textarea>
          <div className="grid grid-cols-3 mb-10 justify-items-center">
            <div className="col-span-1">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="">
                    <div>
                      <Icon path={mdiMusicNote} color="white" size={1} />
                      <span className="text-slate-400 mt-1">Mix</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 h-5/6">
                  <span>Mix Drawer</span>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    {/* <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose> */}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            <div className="col-span-1">
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
                  <DrawerFooter>
                    <Button>Submit</Button>
                    {/* <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose> */}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            <div className="col-span-1">
              <Dialog>
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
                        <Input id="link" className="bg-slate-800" />
                      </div>
                      <Button size="sm" className="px-3 ms-1">
                        Save
                      </Button>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
      </div>
      <div className="grid w-full grid-cols-3 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
        <div className="">
          <Icon path={mdiHomeOutline} color="white" size={1} />
        </div>
        <div className="">
          <Icon path={mdiChatOutline} color="white" size={1} />
        </div>
        <div className="">
          <Icon path={mdiPencilPlus} color="white" size={1} />
        </div>
      </div>
    </>
  );
}
