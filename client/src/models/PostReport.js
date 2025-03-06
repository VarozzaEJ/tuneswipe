import { Account } from "./Account.js"

export class PostReport {
    constructor(data) {
        this.creatorId = data.creatorId
        this.id = data.id
        this.type = data.type
        this.description = data.description
        this.postId = data.postId
        this.creatorName = data.postCreatorName
        this.createdAt = new Date(data.createdAt)
        this.postOrComment = "post"
        this.creatorPicture = data.postCreatorPicture ? data.postCreatorPicture : ""
        this.creator = data.creator ? new Account(data.creator) : null
    }


}