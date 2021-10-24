import { Product, Message } from './types';
import mongoose from 'mongoose';
import { prodModel } from './models/products';
import { msgModel } from './models/message';
import faker from 'faker';
import { normalize, schema } from 'normalizr';

class Utils {
  static async connectToDb() {
    try {
      await mongoose.connect("mongodb://localhost:27017/ecommerce");
    } catch (error) {
      console.log(error);
    };
  };

  static async getAllProducts() {
    try {
      return await prodModel.find().lean();
    } catch (error) {
      console.error(error);
    };
  };

  static async getProductByID(id: string) {
    try {
      return await prodModel.findById(id);
    } catch (error) {
      console.error(error);
    };
  };

  static async saveProduct(product: Product) {
    try {
      await prodModel.create(product);
    } catch (error) {
      console.error(error);
    };
  };

  static async updateProduct(product: Product, id: string) {
    try {
      return await prodModel.findByIdAndUpdate(id, product)
    } catch (error) {
      console.error(error);
    };
  };

  static async deleteProduct(id: string) {
    try {
      const productToDelete = await prodModel.findByIdAndDelete(id);
      return productToDelete;
    } catch (error) {
      console.error(error);
    };
  };
};

//Las funciones a continuacion, son para los messages
export const getMessages = async () => {
  try {
    const rawMessages = await msgModel.find();
    if (rawMessages.length === 0) {
      return rawMessages;
    }

    const messages = rawMessages.map(rawMsg => rawMsg.toObject());

    const author = new schema.Entity('authors', {}, {
      idAttribute: 'email'
    });

    const message = new schema.Entity('messages', { author }, {
      idAttribute: '_id'
    });
    
    const normalizedMessages = normalize(messages, [message]);
    normalizedMessages.result = normalizedMessages.result.map((objectId: any) => objectId.toString());
    return normalizedMessages;
  } catch (error) {
    console.error(error);
  }
};

export const saveMessage = async (message: Message) => {
  try {
    await msgModel.insertMany(message);
  } catch (error) {
    console.error(error);
  };
};

export const getProductsMock = (cant: number) => {
  faker.locale = "es";

  const cantidadAGenerar = isNaN(cant) ? 10 : cant;
  const data: Product[] = [];

  for (let index = 0; index < cantidadAGenerar; index++) {
    let id = 0;
    let price = Number(faker.commerce.price());
    data.push({
      id: ++id,
      title: faker.name.title(),
      price,
      thumbnail: faker.image.imageUrl(),
    });
  };
  return data;
};

export default Utils;