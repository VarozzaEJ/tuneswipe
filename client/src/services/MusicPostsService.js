import { AppState } from "../AppState.js"
import { MusicPost } from "../models/MusicPost.js"
import { api } from "./AxiosService.js"


class MusicPostsService {
    async getAllPosts() {
        try {
            const response = await api.get('/create')
            const musicPosts = response.data.map(musicPostPojo => new MusicPost(musicPostPojo))
            AppState.musicPosts = musicPosts
            return musicPosts
        } catch (error) {
            console.error(error)
        }
    }
}

export const musicPostsService = new MusicPostsService()