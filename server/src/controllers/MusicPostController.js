import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { musicPostsService } from "../services/MusicPostService.js";


export class MusicPostController extends BaseController {
    constructor() {
        super("create")
        this.router
            .get('', this.getAllMusicPosts)
            .get('/profiles/:profileId', this.getProfilePosts)
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createMusicPost)
            .delete('/:musicPostId', this.deletePost)
            .post('/report', this.reportPost)
            .get('/report', this.getReportedPosts)
    }
    async getProfilePosts(request, response, next) {
        try {
            const profileId = request.params.profileId
            const profilePosts = await musicPostsService.getProfilePosts(profileId)
            response.send(profilePosts)
        } catch (error) {
            next(error)
        }
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

    async reportPost(request, response, next) {
        try {
            const userId = request.userInfo.id
            request.body.creatorId = userId
            const report = await musicPostsService.reportPost(request.body)
            response.send(report)

        } catch (error) {
            next(error)
        }
    }

    async getReportedPosts(request, response, next) {
        try {
            const userId = request.userInfo.id
            const reportedPosts = await musicPostsService.getReportedPosts(userId)
            response.send(reportedPosts)
        } catch (error) {
            next(error)
        }
    }
}