require('dotenv').config()

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
                redirectUri: process.env.REDIRECT_URI,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
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
                redirectUri: process.env.REDIRECT_URI,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
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