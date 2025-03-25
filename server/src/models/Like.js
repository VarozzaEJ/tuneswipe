import { Schema } from "mongoose";


export const MusicPostLikeSchema = new Schema({

    accountId: { type: Schema.ObjectId, ref: 'Account', required: true },
    postId: { type: Schema.ObjectId, ref: 'MusicPost', required: true },

}, { timestamps: true, toJSON: { virtuals: true } })

MusicPostLikeSchema.virtual('profile', {
    localField: 'accountId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true, //NOTE justone might not be the move on here because there are mutliple tickets for each event. Not sure tho.
})

MusicPostLikeSchema.virtual('post', {
    localField: 'postId',
    ref: 'MusicPost',
    foreignField: '_id',
    justOne: true
})