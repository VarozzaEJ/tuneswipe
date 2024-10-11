import { dbContext } from "../db/DbContext.js"


class MusicPostService {
    async getAllMusicPosts() {
        const musicPosts = await dbContext.MusicPosts.find().populate('creator')
        return musicPosts
    }
    async createMusicPost(musicPostData) {
        const musicPost = await dbContext.MusicPosts.create(musicPostData)
        await musicPost.populate('creator')
        return musicPost
    }
}

export const musicPostsService = new MusicPostService()