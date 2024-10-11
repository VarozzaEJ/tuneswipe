import mongoose from "mongoose";
const Schema = mongoose.Schema


export const MusicPostSchema = new Schema({
    creatorId: { type: Schema.ObjectId, ref: 'Account', required: true },
    textComment: { type: String, required: true },
    trackIds: [{ type: String }],
    picture: { type: String }
}, { timestamps: true, toJSON: { virtuals: true } })

MusicPostSchema.virtual('creator', {
    localField: 'creatorId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})