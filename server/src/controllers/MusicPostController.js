import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { musicPostsService } from "../services/MusicPostService.js";


export class MusicPostController extends BaseController {
    constructor() {
        super("create")
        this.router
            .get('', this.getAllMusicPosts)
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createMusicPost)
            .delete('/:musicPostId', this.deletePost)
    }

    async createMusicPost(request, response, next) {
        try {
            const userId = request.userInfo.id
            request.body.creatorId = userId
            const musicPost = await musicPostsService.createMusicPost(request.body)
            response.send(musicPost)
        } catch (error) {
            next(error)
        }
    }

    async getAllMusicPosts(request, response, next) {
        try {
            const musicPosts = await musicPostsService.getAllMusicPosts()
            response.send(musicPosts)
        } catch (error) {
            next(error)
        }
    }

    async deletePost(request, response, next) {
        try {
            const userId = request.userInfo.id
            const musicPostId = request.params.musicPostId
            await musicPostsService.deletePost(userId, musicPostId)
            response.send("Post Deleted")
        } catch (error) {
            next(error)
        }
    }
}