import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"


class LikesService {
    async getPostLikes(postId) {
        const postLikers = await dbContext.MusicPostLikes.find({ postId }).populate('profile')
        return postLikers
    }
    async getMyLikedPosts(accountId) {
        const likes = await dbContext.MusicPostLikes.find({ accountId }).populate({ path: 'post', populate: { path: 'creator likeCount' } })
        return likes
    }
    async createLike(likeData) {
        const like = await dbContext.MusicPostLikes.create(likeData)
        await like.populate('post profile')
        return like
    }
    async deleteLike(postLikerId, userId) {
        const likeToDelete = await dbContext.MusicPostLikes.findById(postLikerId)
        if (userId != likeToDelete.accountId) throw new Forbidden("You cannot remove a like that you didn't create")
        await likeToDelete.deleteOne()
    }

}

export const likesService = new LikesService()