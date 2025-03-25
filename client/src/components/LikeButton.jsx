import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { observer } from "mobx-react";
import React from "react";
import { AppState } from "../AppState.js";

function LikeButton({ post }) {
  const authenticated = (
    <div className="flex">
      {post.likeCount.find((like) => like.accountId == AppState.account?.id) ? (
        <div
          onClick={() => {
            // unLikePost(post.id);
          }}
        >
          <Icon path={mdiHeart} color={"red"} size={1} />
        </div>
      ) : (
        <div
          onClick={() => {
            // likePost(post.id);
            console.log(
              post.likeCount.find(
                (like) => like.accountId === AppState.account?.id
              )
            );
          }}
        >
          <Icon path={mdiHeartOutline} color={"white"} size={1} />
        </div>
      )}
      <span className="text-white ps-1">{post.likeCount.length}</span>
    </div>
  );

  const notAuthenticated = (
    <div className="flex">
      <div>
        <Icon
          path={mdiHeartOutline}
          title="Please login to like posts."
          size={1}
        />
      </div>
      <span className="text-white ps-1">{post.likeCount.length}</span>
    </div>
  );

  return <div>{!AppState.account?.id ? notAuthenticated : authenticated}</div>;
}

export default observer(LikeButton);
