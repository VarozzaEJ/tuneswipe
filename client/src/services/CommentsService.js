import { AppState } from "../AppState.js"
import { Comment } from "../models/Comment.js"
import { api } from "./AxiosService.js"

class CommentsService {
    async deleteComment(commentId) {
        const commentToDelete = await api.delete(`api/comments/${commentId}`)
        return commentToDelete
    }
    async getAllComments(postId) {
        AppState.comments = []
        const response = await api.get(`api/comments/${postId}`)
        const comments = response.data.map(commentData => new Comment(commentData))
        AppState.comments = comments
        return comments
    }
    async createComment(commentData) {
        const response = await api.post('api/comments', commentData)
        const newComment = new Comment(response.data)
        AppState.comments.unshift(newComment)
        return newComment
    }
}

export const commentsService = new CommentsService()