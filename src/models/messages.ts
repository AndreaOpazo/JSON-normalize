import mongoose from 'mongoose';
import { authorsSchema } from './author';

const messagesCollection = 'messages';
const messagesSchema = new mongoose.Schema({
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
  author: authorsSchema
});

export const msgModel = mongoose.model(messagesCollection, messagesSchema);