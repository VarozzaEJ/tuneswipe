import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { commentsService } from "../services/CommentsService.js";


export class CommentsController extends BaseController {
    constructor() {
        super('api/comments')
        this.router
            .get('/:postId', this.getPostComments)
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createComment)
            .delete('/:commentId', this.deleteComment)
            .post('/report', this.reportComment)
    }

    async getPostComments(request, response, next) {
        try {
            const postId = request.params.postId
            const comment = await commentsService.getPostComments(postId)
            response.send(comment)
        } catch (error) {
            next(error)
        }
    }

    async createComment(request, response, next) {
        try {
            const user = request.userInfo
            const commentData = request.body
            commentData.creatorId = user.id
            const newComment = await commentsService.createComment(commentData)
            response.send(newComment)
        } catch (error) {
            next(error)
        }
    }

    async deleteComment(request, response, next) {
        try {
            const commentId = request.params.commentId
            const user = request.userInfo
            const commentData = request.body
            const message = await commentsService.deleteComment(commentId, user.id)
            response.send(message)
        } catch (error) {
            next(error)
        }
    }

    async reportComment(request, response, next) {
        try {
            const userId = request.userInfo.id
            request.body.creatorId = userId
            const report = await commentsService.reportComment(request.body)
            response.send(report)
        } catch (error) {
            next(error)
        }
    }
}