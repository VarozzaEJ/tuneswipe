import { observer } from "mobx-react";
import React from "react";
import { AppState } from "../AppState.js";
import Icon from "@mdi/react";
import { mdiChatOutline, mdiHomeOutline, mdiPencilPlusOutline } from "@mdi/js";
import Login from "../components/Login.jsx";
import { Link } from "react-router-dom";

function AccountPage() {
  return (
    <div className="">
      <div className="h-screen flex flex-col justify-between">
        <div className="p-5 text-center flex flex-col justify-center items-center gap-y-4">
          <img
            src={AppState.account.picture}
            alt={AppState.account.name}
            className="rounded-full"
            height="200"
          />
          <p className="my-2">{AppState.account.name}</p>
          <kbd>{AppState.account.email}</kbd>
        </div>
        <div className="grid w-full grid-cols-4 fixed bottom-0 h-10 left-0 items-center justify-items-center bg-slate-950">
          <div className="cursor-pointer">
            <Icon path={mdiHomeOutline} color="white" size={1} />
          </div>
          <div className="cursor-pointer">
            <Icon path={mdiChatOutline} color="white" size={1} />
          </div>
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
