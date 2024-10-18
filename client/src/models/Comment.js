import moment from "moment/moment.js"
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
    get fromNow() {
        return moment(this.createdAt).fromNow()
        // toLocaleString('en-us', { year: '2-digit', month: '2-digit', day: '2-digit' })
    }
}