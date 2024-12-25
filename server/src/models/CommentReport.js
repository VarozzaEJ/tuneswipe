import { Schema } from "mongoose";

export const CommentReportSchema = new Schema({
    creatorId: { type: Schema.ObjectId, ref: 'Account', required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    commentCreatorName: { type: String, required: true },
    commentId: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true } })

CommentReportSchema.virtual('creator', {
    localField: 'creatorId',
    foreignField: '_id',
    ref: "Account",
    justOne: true,
})