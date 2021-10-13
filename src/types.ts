export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export type Author = {
  id: string;
  name: string;
  surname: string;
  age: number;
  alias: string;
  avatar: string;
}

export type Message = {
  author: Author; 
  text: string;
  date: string;
}