import { min } from "moment/moment.js";
import { Schema } from "mongoose";


export const FeatureRequestSchema = new Schema({
    creatorId: { type: Schema.Types.ObjectId },
    firstName: { type: String, required: true, minLength: 2, maxLength: 50 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 50 },
    email: { type: String, required: true },
    description: { type: String, required: true, minLength: 15, maxLength: 500 },
    reproduction: { type: String, required: true, minLength: 15, maxLength: 500 },
}, { timestamps: true, toJSON: { virtuals: true } })

FeatureRequestSchema.virtual('creator', {
    localField: 'creatorId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})