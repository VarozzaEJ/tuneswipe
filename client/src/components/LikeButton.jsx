import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { observer } from "mobx-react";
import React from "react";
import { AppState } from "../AppState.js";
import { musicPostsService } from "../services/MusicPostsService.js";

function LikeButton({ post, musicPosts, setMusicPosts, iconsWhite }) {
  async function unLikePost(postId) {
    const postLikerData = { postId: postId };
    const foundPost = musicPosts.find((post) => post.id == postId);
    const likeId = foundPost.likeCount.find(
      (like) => like.accountId == AppState.account?.id
    ).id;
    const successful = await musicPostsService.unLikePost(
      likeId,
      postLikerData
    );
    if (successful) {
      const updatedPosts = musicPosts.map((post) => {
        if (post.id == postId) {
          post.isLiked = false;
          const foundLike = post.likeCount.findIndex(
            (like) => like.id == likeId
          );
          post.likeCount.splice(foundLike, 1);
        }
        return post;
      });
      setMusicPosts(updatedPosts);
    }
  }

  async function likePost(postId) {
    const postLikerData = { postId: postId };
    const newLike = await musicPostsService.likePost(postLikerData);
    if (newLike) {
      const updatedPosts = musicPosts.map((post) => {
        if (post.id == postId) {
          post.isLiked = true;
          post.likeCount.push(newLike);
        }
        return post;
      });
      setMusicPosts(updatedPosts);
    }
  }

  console.log(post);

  const authenticated = (
    <div className="flex">
      {post.likeCount?.find((like) => like.accountId == AppState.account?.id) ||
      post.isLiked ? (
        <div
          className="cursor-pointer"
          aria-describedby="Unlike this post"
          aria-roledescription="This button unlikes the post if you have liked it"
          title="Unlike this post"
          onClick={() => {
            unLikePost(post.id);
          }}
        >
          <Icon path={mdiHeart} color={"red"} size={1} />
        </div>
      ) : (
        <div
          className="cursor-pointer"
          aria-describedby="Like this post"
          aria-roledescription="This button likes the post if you have not already liked it"
          title="Like this post"
          onClick={() => {
            likePost(post.id);
          }}
        >
          {iconsWhite ? (
            <Icon path={mdiHeartOutline} color={"white"} size={1} />
          ) : (
            <Icon path={mdiHeartOutline} color={"black"} size={1} />
          )}
        </div>
      )}
      {iconsWhite ? (
        <span className="text-white ps-1">{post.likeCount.length}</span>
      ) : (
        <span className="text-black ps-1">{post.likeCount.length}</span>
      )}
    </div>
  );

  const notAuthenticated = (
    <div className="flex">
      <div className="cursor-not-allowed">
        {iconsWhite ? (
          <Icon
            path={mdiHeartOutline}
            title="Please login to like posts."
            size={1}
          />
        ) : (
          <Icon
            path={mdiHeartOutline}
            title="Please login to like posts."
            color="black"
            size={1}
          />
        )}
      </div>
      {iconsWhite ? (
        <span className="text-white ps-1">{post.likeCount.length}</span>
      ) : (
        <span className="text-black ps-1">{post.likeCount.length}</span>
      )}
    </div>
  );

  return <div>{!AppState.account?.id ? notAuthenticated : authenticated}</div>;
}

export default observer(LikeButton);
