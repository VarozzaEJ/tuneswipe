import { Account } from "./Account.js"

export class PostReport {
    constructor(data) {
        this.creatorId = data.creatorId
        this.type = data.type
        this.description = data.description
        this.postId = data.postId
        this.postCreatorId = data.postCreatorId
        this.createdAt = new Date(data.createdAt)
        this.creator = new Account(data.creator)
    }
}