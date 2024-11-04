import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { AppState } from "../AppState.js";
import Icon from "@mdi/react";
import { mdiAccount, mdiChatOutline, mdiHomeOutline, mdiPencilPlusOutline } from "@mdi/js";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <div className="">
      <div className="h-screen flex flex-col justify-between">
        <div className="p-5 text-center flex flex-col justify-center items-center gap-y-4">
          {profilePicture !== "" && (
            <Avatar className={"h-40 w-40 static"}>
                                <AvatarImage className="" src={profilePicture} />
                                <AvatarFallback>
                                  <Icon
                                    path={mdiAccount}
                                    color="black"
                                    size={1}
                                  />
                                </AvatarFallback>
                              </Avatar>
          )}
          <p className="my-2">{AppState.account.name}</p>
          <kbd>{AppState.account.email}</kbd>
          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
              <Button variant={"secondary"} className={"w-full"}>
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
