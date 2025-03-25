import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"


class MusicPostService {
    async getProfilePosts(creatorId) {
        const profilePosts = await dbContext.MusicPosts.find({ creatorId }).populate("creator likeCount")
        return profilePosts
    }
    async getReportedPosts(creatorId) {
        const reportedPosts = await dbContext.PostReports.find({ creatorId })
        return reportedPosts
    }
    async reportPost(reportData) {
        const report = await dbContext.PostReports.create(reportData)
        await report.populate('creator likeCount')
        return report
    }
    async deletePost(userId, musicPostId) {
        const musicPost = await this.getMusicPostById(musicPostId)
        if (musicPost.creatorId != userId) throw new Forbidden("You cannot delete a post you didn't create.")
        await dbContext.MusicPosts.findByIdAndDelete(musicPostId)
    }
    async getAllMusicPosts() {
        const musicPosts = await dbContext.MusicPosts.find().populate('creator likeCount')
        return musicPosts
    }
    async createMusicPost(musicPostData) {
        const musicPost = await dbContext.MusicPosts.create(musicPostData)
        await musicPost.populate('creator likeCount')
        return musicPost
    }

    async getMusicPostById(musicPostId) {
        const musicPost = await dbContext.MusicPosts.findById(musicPostId)
        return musicPost
    }
}

export const musicPostsService = new MusicPostService()