import { Account } from "../models/Account.js"
import { MusicPost } from "../models/MusicPost.js"
import { api } from "./AxiosService.js"


class ProfilesService {
    async getProfilePosts(profileId) {
        const response = await api.get(`create/profiles/${profileId}`)
        const profilePosts = response.data.map((postPOJO) => new MusicPost(postPOJO))
        profilePosts.reverse()
        return profilePosts
    }
    async getProfileById(profileId) {
        const response = await api.get(`api/profiles/${profileId}`)
        const newProfile = new Account(response.data)
        return newProfile
    }
}

export const profilesService = new ProfilesService()