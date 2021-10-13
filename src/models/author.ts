import mongoose from 'mongoose';

const authorCollection = 'author';
export const authorsSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    max: 50,
  },
  name: {
    type: String,
    require: true,
  },
  surname: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  alias: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  }
});

export const authorModel = mongoose.model(authorCollection, authorsSchema);