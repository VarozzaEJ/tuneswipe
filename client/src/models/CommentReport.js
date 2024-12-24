import { Account } from "./Account.js"

export class CommentReport {
    constructor(data) {
        this.createdAt = new Date(data.createdAt)
        this.id = data.id
        this.creator = new Account(data.creator)
        this.creatorId = data.creatorId
        this.type = data.type
        this.description = data.description
        this.commentId = data.commentId
        this.commentCreatorId = data.commentCreatorId
    }
}