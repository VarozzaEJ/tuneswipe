import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { AppState } from "../AppState.js";
import Icon from "@mdi/react";
import { mdiAccount, mdiAccountOutline, mdiChatOutline, mdiChevronRight, mdiClose, mdiHomeOutline, mdiImage, mdiLoading, mdiPencilPlusOutline } from "@mdi/js";
import Login from "../components/Login.jsx";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {accountService} from "../services/accountservice.js"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthService } from "../services/AuthService.js";
import {musicPostsService} from "../services/musicPostsService.js"
import {commentsService} from "../services/commentsService.js"

type FormData = {
  name: string;
  picture: string;
}

const formSchema: ZodType<FormData> = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(100, {
    message: "Name cannot exceed 100 characters"
  }).optional(),
  picture: z.string().min(25, {
    message: "Picture must be at least 25 characters.",
  }).max(1000, {
    message: "Character limit must not exceed 1000"
  }).optional()
});


function AccountPage() {
  const [profilePicture, setProfilePicture] = useState("");
  const [open, setOpen] = useState(false)
  const [reports, setReports] = useState([])
  const [noReports, setNoReports] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(!AppState.account) return
    setValue("name", AppState.account.name)
    setValue("picture", AppState.account.picture)
  },[AppState.account])

  useEffect(() => {
    setProfilePicture(AppState.account?.picture);
  }, [AppState.account, AppState.user]);

  const {handleSubmit, register, resetField, setValue, getValues} = useForm<FormData>({resolver: zodResolver(formSchema)})

  const submitForm = async (data: FormData) => {
      await accountService.updateAccount(data)
      setOpen(false)
    }

    function logout() {
    localStorage.removeItem("user-token");
    //FIXME Logout does not work, redirects to port 8080 for an unknown reason.
    AuthService.logout({});
    window.location.assign('#')
  }

  async function getYourReports() {
    setTimeout(async () => {
      const postReports = await musicPostsService.findReportedPosts()
      const commentReports = await commentsService.findReportedComments()
      setReports(postReports)
      setReports((report) => [...report, ...commentReports])
      setLoading(false)
      if(postReports.length == 0 || commentReports.length == 0) setNoReports(true)
    }, 2000)
  }

  return (
    <div className="h-screen">
      <div className="h-[95%] flex flex-col justify-between">
        <div className="p-5 text-center flex flex-col justify-center items-center gap-y-4">
          {profilePicture !== "" && (
            <Avatar className={"h-40 w-40 static"}>
                                <AvatarImage className="" src={profilePicture} />
                                <AvatarFallback>
                                  <Icon
                                    path={mdiAccount}
                                    color="black"
                                    size={4}
                                  />
                                </AvatarFallback>
                              </Avatar>
          )}
          <p className="my-2">{AppState.account.name}</p>
          <kbd>{AppState.account.email}</kbd>
          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
              <Button variant={"secondary"} className={"w-full sm:w-80"}>
                Edit Profile
              </Button>
            </SheetTrigger>
            <SheetContent className={"bg-slate-950 border-none w-full"}>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <SheetHeader>
              </SheetHeader>
              <form onSubmit={handleSubmit(submitForm)}>
              <div>
              <Label className="mt-3" htmlFor="name">Name</Label>
              <Input {...register("name")}  id="name" className="text-black" />
              </div>
              <div className="flex justify-center items-center mt-5">
                {profilePicture !== "" ? 
                <img src={profilePicture} className="w-52 h-52 rounded-sm" alt="" /> :
                  <div className="bg-subtle rounded-lg h-52 w-52 flex justify-center items-center">
                    <Icon path={mdiImage} color="white" />
                  </div> }
              </div>
              <div className="mt-5">
              <Label className="mt-10" htmlFor="picture">Picture</Label>
              <Input {...register("picture")} id="picture" className="text-black" />
              </div>
              <div className="flex w-full justify-end">
                <Button className="mt-3" variant={"secondary"}>Submit</Button>
              </div>
              </form>
            </SheetContent>
          </Sheet>
          <Drawer>
            <DrawerTrigger asChild>
                  <Button onClick={() => {
                    getYourReports()
                  }} className="w-full bg-inherit" variant={"outline"}>See Reported Items</Button>
            </DrawerTrigger>
            <DrawerContent className="bg-slate-800">
              <div className="grid grid-cols-3 sticky items-center bg-inherit -mt-4 mb-4 top-0 ">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 h-10 ">
                        <DrawerTitle className="text-center text-2xl mt-1">
                          Reports
                        </DrawerTitle>
                      </div>
                      <div className="col-span-1 h-10 flex justify-end items-center">
                        <DrawerClose className="text-center">
                          <Icon
                            className="me-4"
                            path={mdiClose}
                            color="white"
                            size={1}
                          />
                        </DrawerClose>
                      </div>
                    </div>
              <DrawerDescription></DrawerDescription>
              <div className="mt-3 flex flex-col items-center w-full overflow-y-scroll justify-center">
                {reports.length !== 0 && 
                reports.map((report) => (
                  
                <Popover key={report.id}>
                  <PopoverTrigger asChild>

                  <div className="w-11/12 border cursor-pointer ease-in-out transition-all hover:border-slate-200 border-t-0 border-s-0 border-e-0 mb-3 border-slate-400 h-20">
                  <div className="flex items-center justify-between h-20">
                    <div className="flex">

                    <div className="flex justify-center border border-slate-400 w-10 h-10 items-center">
                      <Icon path={mdiAccountOutline} color="white"/>
                    </div>
                    <div className="ms-2">

                      <div>
                        <span className="text-slate-400 capitalize">{report.postOrComment} - {report.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span>You reported {report.creatorName}'s {report.postOrComment}</span>
                      </div>
                    </div>

                    </div>
                        <div className="cursor-pointer">
                          <Icon path={mdiChevronRight} color={"gray"} size={1}/>
                        </div>
                  </div>
                  </div>
                        </PopoverTrigger>
                        <PopoverContent side={"top"} className="bg-slate-800 text-slate-200">
                          <div>
                            <span className=" capitalize">Reason: {report.type}</span>
                          </div>
                          <div>
                            <span>Description: {report.description}</span>
                          </div>
                        </PopoverContent>
                </Popover>
                ))}
                {loading && <div>
                  <Icon path={mdiLoading} spin size={3}/>
                </div>}
                {noReports && <div className="my-10">
                  <span className="text-slate-400">You haven't reported anything.</span>
                  </div>}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="p-5 flex justify-center">
          <Button onClick={logout} className="w-full sm:w-80" variant={"destructive"}>
            Logout
          </Button>
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
          <Link to={"/create"}>
            <div className="cursor-pointer">
              <Icon path={mdiPencilPlusOutline} color="white" size={1} />
            </div>
          </Link>
          <Login />
        </div>
      </div>
    </div>
  );
}

export default observer(AccountPage);
