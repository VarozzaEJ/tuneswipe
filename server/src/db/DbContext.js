import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ValueSchema } from '../models/Value'
import { MusicPostSchema } from '../models/MusicPost.js';

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);

  MusicPosts = mongoose.model('MusicPost', MusicPostSchema)
}

export const dbContext = new DbContext()
