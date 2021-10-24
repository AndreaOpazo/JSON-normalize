import { schema } from "normalizr";

const author = new schema.Entity('authors', undefined, { idAttribute: 'email' });

export const message = new schema.Entity('messages', {
  author: author
});

// export const messagesSchema = new schema.Entity('messages', {
//   messages: [messageSchema]
// });