import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { AppState } from "../AppState.js";
import Icon from "@mdi/react";
import { mdiAccount, mdiAccountOutline, mdiChatOutline, mdiChevronRight, mdiClose,  mdiCogOutline,  mdiEmailOutline, mdiFlagOutline, mdiHelpCircleOutline, mdiHomeOutline, mdiImage, mdiLoading, mdiLogout, mdiPencilPlusOutline, mdiRocketLaunchOutline } from "@mdi/js";
import Login from "../components/Login.jsx";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {accountService} from "../services/accountservice.js"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ReportBugForm from "@/components/ReportBugForm.js";
import RequestFeatureForm from "@/components/RequestFeatureForm.js";
import { Separator } from "@/components/ui/separator.js";

type FormData = {
  name: string;
  picture: string;
}

type Report = {
  id: string;
  creatorName: string;
  postOrComment: string;
  type: string;
  description: string;
  createdAt: Date;
  creatorPicture: string;
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
  const [reports, setReports] = useState<Report[]>([])
  const [noReports, setNoReports] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reportBugDialogOpen, setReportBugDialogOpen] = useState(false)
  const [requestFeatureDialogOpen, setRequestFeatureDialogOpen] = useState(false)

  useEffect(() => {
    if(!AppState.account) return
    setValue("name", AppState.account.name)
    setValue("picture", AppState.account.picture)
  },[AppState.account])

  useEffect(() => {
    setProfilePicture(AppState.account?.picture);
  }, [AppState.account, AppState.user]);

  const {handleSubmit, register, setValue} = useForm<FormData>({resolver: zodResolver(formSchema)})

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
      setReports((reports) => [...reports, ...commentReports])
      setLoading(false)
      if(postReports.length == 0 && commentReports.length == 0) setNoReports(true)
    }, 2000)
  }


  return (
    <div className="h-screen">
      <div className="h-[95%] flex flex-col justify-around">
        <div className="p-5 md:gap-x-2 text-center flex max-md:flex-col justify-center items-center">
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
          <div>

          <p className="text-2xl my-1 font-bold">{AppState.account.name}</p>
          {/* <Badge className="bg-slate-800 text-slate-200">Member Since: {AppState.account.memberSince}</Badge> */}
          <span className="flex"><Icon className="pe-1" path={mdiEmailOutline} size={1}/>{AppState.account.email}</span>
                </div>
        </div>
          <div className="flex sm:justify-around flex-col justify-center items-center gap-y-3">
            <div className="flex w-full justify-center items-center max-sm:gap-y-2 max-sm:flex-col gap-x-2">


          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
              <Button variant={"secondary"} className={"w-3/4  sm:w-80"}>
                <Icon path={mdiCogOutline} size={1} className="pe-1"/>Edit Profile
              </Button>
            </SheetTrigger>
            <SheetContent className={"bg-slate-800 border-none w-full"}>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <SheetHeader>
              </SheetHeader>
              <form onSubmit={handleSubmit(submitForm)}>
              <div>
              <Label className="mt-3" htmlFor="name">Name</Label>
              <Input {...register("name")} id="name" className="border-0 active:border-0 mt-1 bg-slate-950" />
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
                <Input {...register("picture")} id="picture" className="border-0 active:border-0 mt-1 bg-slate-950" />
              </div>
              <div className="flex w-full justify-end">
                <Button  className="mt-3" >Submit</Button>
              </div>
              </form>
            </SheetContent>
          </Sheet>
          <Drawer>
            <DrawerTrigger asChild>
                  <Button onClick={() => {
                    getYourReports()
                  }} className="w-3/4 sm:w-80 bg-inherit" variant={"outline"}><Icon path={mdiFlagOutline} size={1} className="pe-1"/>See Reported Items</Button>
            </DrawerTrigger>
            <DrawerContent className="bg-slate-800 max-h-[600px] rounded-t-[10px]">
              <div className="grid grid-cols-3 items-center bg-inherit sticky mt-2 top-0 ">
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
              <div className=" pt-5 flex flex-col items-center w-full overflow-y-auto justify-center">
                {reports.length !== 0 && 
                reports.map((report) => (
                  
                  <Popover key={report.id}>
                  <PopoverTrigger className="w-11/12">

                  <div role="button" className="w-full border cursor-pointer ease-in-out transition-all hover:border-slate-200 border-t-0 border-s-0 border-e-0 mb-3 border-slate-400 h-20">
                  <div className="flex items-center justify-between h-20">
                    <div className="flex">

                    <div className="flex justify-center border border-slate-400 w-12 h-12 items-center">
                      {report.creatorPicture == "" ?
                      <Icon path={mdiAccountOutline} color="white" size={1}/>
                      :
                      <img src={report.creatorPicture} className={"w-12 h-12"}/>
                    }
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
              <Separator className="w-3/4 sm:w-4/6 md:w-1/2"/>

        <div className=" flex w-full justify-center items-center max-sm:gap-y-2 max-sm:flex-col gap-x-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-3/4 sm:w-80" variant={"secondary"}><Icon path={mdiHelpCircleOutline} size={1} className="pe-1"/>Help</Button>
            </DrawerTrigger>
            <DrawerContent className="bg-slate-800">
              <DrawerTitle></DrawerTitle>
              <DrawerDescription></DrawerDescription>
                  <div className="p-3 ">
                    <Dialog onOpenChange={setReportBugDialogOpen} open={reportBugDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="hover:text-slate-600 delay-75 transition-all ease-in-out flex cursor-pointer mb-4 pt-1 justify-between border border-slate-300 border-e-0 border-t-0 border-s-0">

                        <span className="flex text-lg  ">
                        <Icon
                          path={mdiEmailOutline}
                          color="white"
                          className="me-4"
                          size={1}
                          />
                        Report a Bug
                        </span>
                        <span>
                        <Icon path={mdiChevronRight}
                          color="white"
                          className=""
                          size={1}/>
                            </span>
                          </div>
                          </DialogTrigger>
                          <DialogDescription></DialogDescription>
                            <DialogTitle></DialogTitle>
                          <DialogContent className="bg-slate-800 w-11/12 md:w-full rounded-sm ">
                            <h1 className="w-full text-center text-lg">Report a Bug</h1>
                            <ReportBugForm setReportBugDialogOpen={setReportBugDialogOpen}/>
                          </DialogContent>
                        </Dialog>
                    <Dialog onOpenChange={setRequestFeatureDialogOpen} open={requestFeatureDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="flex hover:text-slate-600 delay-75 transition-all ease-in-out cursor-pointer pb-1 justify-between border border-slate-300 border-e-0 border-t-0 border-s-0">

                        <span className="flex text-lg">
                        <Icon
                          path={mdiRocketLaunchOutline}
                          color="white"
                          className="me-4"
                          size={1}
                          />
                        Request a Feature
                      </span>
                      <span>
                        <Icon path={mdiChevronRight}
                          color="white"
                          className=""
                          size={1}/>
                      </span>
                          </div>
                          </DialogTrigger>
                          <DialogDescription></DialogDescription>
                            <DialogTitle></DialogTitle>
                          <DialogContent className="bg-slate-800 w-11/12 md:w-full rounded-sm ">
                            <h1 className="w-full text-center text-lg">Request a Feature</h1>
                            <RequestFeatureForm setRequestFeatureDialogOpen={setRequestFeatureDialogOpen} />
                          </DialogContent>
                        </Dialog>
                      </div>
            </DrawerContent>
          </Drawer>
          <Button onClick={logout} className="w-3/4 sm:w-80" variant={"destructive"}>
            <Icon path={mdiLogout} className="pe-1" size={1}/>Logout
          </Button>
          </div>
          <div>
          <p className="font-thin text-xs pt-1">App Version 1.0.0</p>
          </div>
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
