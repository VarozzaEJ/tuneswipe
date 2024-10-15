import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"


class MusicPostService {
    async deletePost(userId, musicPostId) {
        const musicPost = await this.getMusicPostById(musicPostId)
        if (musicPost.creatorId != userId) throw new Forbidden("You cannot delete a post you didn't create.")
        await dbContext.MusicPosts.findByIdAndDelete(musicPostId)
    }
    async getAllMusicPosts() {
        const musicPosts = await dbContext.MusicPosts.find().populate('creator')
        return musicPosts
    }
    async createMusicPost(musicPostData) {
        const musicPost = await dbContext.MusicPosts.create(musicPostData)
        await musicPost.populate('creator')
        return musicPost
    }

    async getMusicPostById(musicPostId) {
        const musicPost = await dbContext.MusicPosts.findById(musicPostId)
        return musicPost
    }
}

export const musicPostsService = new MusicPostService()