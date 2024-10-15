import { Account } from "./Account.js"


export class Comment {
    constructor(data) {
        this.body = data.body
        this.creatorId = data.creatorId
        this.id = data.id || data._id
        this.createdAt = new Date(data.createdAt)
        this.creator = data.creator ? new Account(data.creator) : null
        this.musicPostId = data.musicPostId
    }
}