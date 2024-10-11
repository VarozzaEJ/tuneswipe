import { Account } from "./Account.js"

export class MusicPost {
    constructor(data) {
        this.id = data.id
        this.textComment = data.textComment
        this.picture = data.picture
        this.trackIds = data.trackIds
        this.creator = data.creator ? new Account(data.creator) : null
        this.createdAt = new Date(data.createdAt).toLocaleDateString()
        this.updatedAt = data.updatedAt
    }
}