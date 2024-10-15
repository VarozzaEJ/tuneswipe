import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"



class CommentsService {
    async getEventComments(musicPostId) {
        const comments = await dbContext.Comments.find({ musicPostId }).populate('creator')
        return comments
    }
    async createComment(commentData) {
        const comment = await dbContext.Comments.create(commentData)
        await comment.populate('creator')
        return comment
    }
    async deleteComment(commentId, userId, commentData) {
        const commentToDelete = await dbContext.Comments.findById(commentId)
        if (userId != commentToDelete.creatorId) throw new Forbidden("You cannot delete a comment you didn't make")
        await commentToDelete.deleteOne()
        return `Your comment was deleted`
    }

}

export const commentsService = new CommentsService()