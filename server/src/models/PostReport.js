import { Schema } from "mongoose";

export const PostReportSchema = new Schema({
    creatorId: { type: Schema.ObjectId, ref: 'Account', required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    postCreatorName: { type: String, required: true },
    postId: { type: String, required: true },
    postCreatorPicture: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true } })

PostReportSchema.virtual('creator', {
    localField: 'creatorId',
    foreignField: '_id',
    ref: "Account",
    justOne: true,
})