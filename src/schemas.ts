import { schema } from "normalizr";

const authorSchema = new schema.Entity('authors');
export const messageSchema = new schema.Entity('messages', {
  authorSchema
});