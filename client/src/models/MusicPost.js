import moment from "moment"
import { Account } from "./Account.js"

export class MusicPost {
    constructor(data) {
        this.id = data.id
        this.textComment = data.textComment
        this.picture = data.picture
        this.trackIds = data.trackIds
        this.creator = data.creator ? new Account(data.creator) : null
        this.createdAt = new Date(data.createdAt)
        this.updatedAt = data.updatedAt
        this.color = data.color ? data.color : "#94A3B8"
        this.file = data.file
        this.likeCount = data.likeCount
        this.isLiked = data.isLiked
    }

    get fromNow() {
        return moment(this.createdAt).fromNow()
    }

    get areIconsWhite() {
        let rgb = this.color;
        var r = parseInt(rgb.substring(1, 3), 16);
        var g = parseInt(rgb.substring(3, 5), 16);
        var b = parseInt(rgb.substring(5, 7), 16);
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        if (yiq > 125) {
            return false
        } else {
            return true
        }
    }

    get isTextWhite() {
        let rgb = this.color;
        var r = parseInt(rgb.substring(1, 3), 16);
        var g = parseInt(rgb.substring(3, 5), 16);
        var b = parseInt(rgb.substring(5, 7), 16);
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        if (yiq > 125) {
            return "black"
        } else {
            return "white"
        }
    }


}