import { dbContext } from "../db/DbContext.js"


class MusicPostService {
    async createMusicPost(musicPostData) {
        const musicPost = await dbContext.MusicPosts.create(musicPostData)
        await musicPost.populate('creator')
        return musicPost
    }
}

export const musicPostsService = new MusicPostService()