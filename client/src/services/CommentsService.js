import axios from "axios"
import { AppState } from "../AppState.js"
import { Comment } from "../models/Comment.js"
import { CommentReport } from "../models/CommentReport.js"
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

    async reportComment(reportData) {
        const response = await api.post('api/comments/report', reportData)
        const report = new CommentReport(response.data)
        AppState.commentReports.push(report)
        return report
    }

    async findReportedComments() {
        const response = await api.get("/api/comments/report/comments")
        const mappedReports = response.data.map((reportPOJO) => new CommentReport(reportPOJO))
        console.log(mappedReports)
        return mappedReports
    }
}

export const commentsService = new CommentsService()