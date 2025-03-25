import mongoose from "mongoose";
const Schema = mongoose.Schema


export const MusicPostSchema = new Schema({
    creatorId: { type: Schema.ObjectId, ref: 'Account', required: true },
    textComment: { type: String, required: true },
    trackIds: [{ type: String }],
    picture: { type: String },
    file: { type: String, minLength: 1, maxLength: 1000 },
    color: { type: String, required: true },
    isLiked: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true } })

MusicPostSchema.virtual('creator', {
    localField: 'creatorId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})

MusicPostSchema.virtual('likeCount', {
    localField: '_id',
    ref: 'Like',
    foreignField: 'postId',
})