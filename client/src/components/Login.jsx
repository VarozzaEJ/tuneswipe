import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { AppState } from "../AppState.js";
import { AuthService } from "../services/AuthService.js";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Login() {
  function login() {
    AuthService.loginWithPopup();
  }

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
        <img
          src={AppState.account?.picture || AppState.user?.picture}
          alt="account photo"
          style={{ height: 24 }}
          className="rounded cursor-pointer select-none mt-1"
          aria-expanded="false"
        />
      </PopoverTrigger>
      <PopoverContent className="bg-slate-100 flex flex-col">
        <Link className="text-center mb-4" to={"/account"}>
          <span className="text-center">Manage Account</span>
        </Link>
        <Button variant={"ghost"} onClick={logout}>
          Logout
        </Button>
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
