import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { likesService } from "../services/LikesService.js";


export class LikesController extends BaseController {
    constructor() {
        super('api/likes')
        this.router
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createLike)
            .delete('/:postId', this.deletelike)
    }

    async createLike(request, response, next) {
        try {
            const user = request.userInfo
            const likeData = request.body
            likeData.accountId = user.id
            const newLike = await likesService.createLike(likeData)
            response.send(newLike)
        } catch (error) {
            next(error)
        }
    }

    async deletelike(request, response, next) {
        try {
            const postLikerId = request.params.postId
            const userId = request.userInfo.id
            const message = await likesService.deleteLike(postLikerId, userId)
            response.send(message)
        } catch (error) {
            next(error)
        }
    }


}