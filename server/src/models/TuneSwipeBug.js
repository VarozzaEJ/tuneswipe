import { Schema } from "mongoose";


export const TuneSwipeBugSchema = new Schema({
    creatorId: { type: Schema.ObjectId, ref: 'Account', required: true },
    email: { type: String, required: true },
    description: { type: String, required: true, minLength: 15, maxLength: 250 },
    reproduction: { type: String, required: true, minLength: 15, maxLength: 500 },
    file: { type: String, minLength: 1, maxLength: 1000 },
}, { timestamps: true, toJSON: { virtuals: true } })

TuneSwipeBugSchema.virtual('creator', {
    localField: 'creatorId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})
