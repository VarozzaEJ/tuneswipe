import BaseController from '../utils/BaseController.js';

const SpotifyWebApi = require('spotify-web-api-node')
const bodyParser = require('body-parser')

export class SpotifyApiController extends BaseController {
    constructor() {
        super("/login")
        this.router
            .post('', this.login)
            .post('/refresh', this.refresh)
    }
    login(request, response, next) {
        try {
            const code = request.body.code
            const spotifyApi = new SpotifyWebApi({
                redirectUri: "http://localhost:5173",
                clientId: "c4f463066209462aa6798856d58701d9",
                clientSecret: "bfe5ce4a8a654e36ab51e253dc564a9c"
            })
            spotifyApi.authorizationCodeGrant(code).then(data => {
                response.json({
                    accessToken: data.body.access_token,
                    refreshToken: data.body.refresh_token,
                    expiresIn: data.body.expires_in
                })
            })
        }
        catch (error) {
            next(error)
        }
    }

    refresh(request, response, next) {
        try {
            const refreshToken = request.body.refreshToken
            console.log("hi")
            const spotifyApi = new SpotifyWebApi({
                redirectUri: "http://localhost:8080",
                clientId: "c4f463066209462aa6798856d58701d9",
                clientSecret: "bfe5ce4a8a654e36ab51e253dc564a9c",
                refreshToken: ""
            })
            spotifyApi.refreshAccessToken().then(
                (data) => {
                    response.json({
                        accessToken: data.body.access_token,
                        expiresIn: data.body.expires_in
                    })
                }
            ).catch((err) => {
                console.log(err)
            })
        } catch (error) {
            next(error)
        }
    }
}