
export class Like {
    constructor(data) {
        this.id = data.id || data._id
        this.accountId = data.accountId
        this.postId = data.postId
    }
}