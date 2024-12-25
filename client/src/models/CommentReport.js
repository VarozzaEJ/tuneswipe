import { Account } from "./Account.js"

export class CommentReport {
    constructor(data) {
        this.createdAt = new Date(data.createdAt)
        this.id = data.id
        this.creatorId = data.creatorId
        this.type = data.type
        this.description = data.description
        this.commentId = data.commentId
        this.creatorName = data.commentCreatorName
        this.postOrComment = "Comment"
    }
}