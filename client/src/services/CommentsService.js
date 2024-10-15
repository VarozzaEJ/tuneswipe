import { AppState } from "../AppState.js"
import { api } from "./AxiosService.js"

class CommentsService {
    async deleteComment(commentId) {
        const commentToDelete = await api.delete(`api/comments/${commentId}`)
        return commentToDelete
    }
    async getAllComments(musicPostId) {
        AppState.comments = []
        const response = await api.get(`api/events/${musicPostId}/comments`)
        const comments = response.data.map(commentData => new Comment(commentData))
        AppState.comments = comments
    }
    async createComment(commentData) {
        const response = await api.post('api/comments', commentData)
        const newComment = new Comment(response.data)
        // AppState.comments.unshift(newComment)
    }
}

export const commentsService = new CommentsService()