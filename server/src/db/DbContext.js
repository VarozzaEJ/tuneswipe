import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ValueSchema } from '../models/Value'
import { MusicPostSchema } from '../models/MusicPost.js';
import { CommentSchema } from '../models/Comment.js';
import { PostReportSchema } from '../models/PostReport.js';

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);

  Comments = mongoose.model('Comment', CommentSchema)

  MusicPosts = mongoose.model('MusicPost', MusicPostSchema)

  PostReports = mongoose.model('PostReport', PostReportSchema)
}

export const dbContext = new DbContext()
