import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { observer } from "mobx-react";
import React from "react";
import { AppState } from "../AppState.js";
import { musicPostsService } from "../services/MusicPostsService.js";

function LikeButton({ post, musicPosts, setMusicPosts }) {
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
          onClick={() => {
            unLikePost(post.id);
          }}
        >
          <Icon path={mdiHeart} color={"red"} size={1} />
        </div>
      ) : (
        <div
          onClick={() => {
            likePost(post.id);
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
