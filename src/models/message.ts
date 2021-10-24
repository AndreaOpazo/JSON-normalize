import mongoose from 'mongoose';
import { authorSchema } from './author';

const messageCollection = 'message';
export const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
    max: 100,
  },
  date: {
    type: String,
    require: true,
    max: 50,
  },
  author: authorSchema
});

export const msgModel = mongoose.model(messageCollection, messageSchema);