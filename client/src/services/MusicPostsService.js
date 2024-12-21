import { AppState } from "../AppState.js";
import { MusicPost } from "../models/MusicPost.js";
import { api } from "./AxiosService.js";

class MusicPostsService {
  async getAllPosts() {
    try {
      const response = await api.get("/create");
      response.data.reverse()
      const musicPosts = response.data.map(
        (musicPostPojo) => new MusicPost(musicPostPojo)
      );
      AppState.musicPosts = musicPosts;
      return musicPosts;
    } catch (error) {
      console.error(error);
    }
  }

  async createPost(postData) {
    try {
      const response = await api.post("/create", postData);
      const newMusicPost = new MusicPost(response.data);
      AppState.musicPosts.push(newMusicPost);
      return newMusicPost
    } catch (error) {
      console.error(error);
    }
  }

  async deletePost(musicPostId) {
    try {
      await api.delete(`/create/${musicPostId}`)
      const musicPostIndex = AppState.musicPosts.findIndex(postId => postId == musicPostId)
      AppState.musicPosts.splice(musicPostIndex, 1)
    } catch (error) {
      console.error(error)
    }
  }

  async reportPost(reportData) {
    const response = await api.post('/create/report', reportData)
    console.log(response)
  }
}

export const musicPostsService = new MusicPostsService();
