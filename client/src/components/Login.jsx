import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppState } from "../AppState.js";
import { AuthService } from "../services/AuthService.js";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";

function Login({ profilePic }) {
  const [profilePicture, setProfilePicture] = useState("");

  function login() {
    AuthService.loginWithPopup();
  }

  useEffect(() => {
    setProfilePicture(AppState.account?.picture);
  }, [AppState.account]);

  function logout() {
    localStorage.removeItem("user-token");
    //FIXME Logout does not work, redirects to port 8080 for an unkonwn reason.
    AuthService.logout({});
  }

  const notAuthenticated = (
    <Button variant={"ghost"} onClick={login}>
      Login
    </Button>
  );

  const authenticated = (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={profilePicture} className={"h-[24px] w-[24px]"} />
          <AvatarFallback>
            <Icon path={mdiAccount} color="black" size={1} />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="bg-slate-100 flex w-46 flex-col">
        <Link className="text-center mb-4" to={"/account"}>
          <span className="text-center">
            <Button variant={"secondary"}>Manage Account</Button>
          </span>
        </Link>
        <Button onClick={logout}>Logout</Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <div>
      <span className="navbar-text">
        {!AppState.account?.id ? notAuthenticated : authenticated}
      </span>
    </div>
  );
}

export default observer(Login);
