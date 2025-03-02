import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ValueSchema } from '../models/Value'
import { MusicPostSchema } from '../models/MusicPost.js';
import { CommentSchema } from '../models/Comment.js';
import { PostReportSchema } from '../models/PostReport.js';
import { CommentReportSchema } from '../models/CommentReport.js';
import { TuneSwipeBugSchema } from '../models/TuneSwipeBug.js';
import { FeatureRequestSchema } from '../models/FeatureRequest.js';

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);

  Comments = mongoose.model('Comment', CommentSchema)

  MusicPosts = mongoose.model('MusicPost', MusicPostSchema)

  PostReports = mongoose.model('PostReport', PostReportSchema)

  TuneswipeBugs = mongoose.model('TuneswipeBug', TuneSwipeBugSchema)

  FeatureRequests = mongoose.model('FeatureRequest', FeatureRequestSchema)

  CommentReports = mongoose.model('CommentReport', CommentReportSchema)
}

export const dbContext = new DbContext()
