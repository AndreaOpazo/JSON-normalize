import express, { Request, Response } from "express";
import handlebars from "express-handlebars";
import http from "http";
import path from "path";
import { Server }from "socket.io";
import Utils, { getMessages, updateMessages, getProductsMock} from './utils';

const app = express();
const router = express.Router();
const server = http.createServer(app);
const ioServer = new Server(server);
const port = 8080;

server.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

server.on("error", (error) => {
  console.log('Error: ', error);
});

const ENGINE_NAME = "hbs";

app.engine(
  ENGINE_NAME,
  handlebars({
    extname: `.${ENGINE_NAME}`,
    layoutsDir: path.join(__dirname, './views/layouts'),
    defaultLayout: path.join(__dirname, './views/layouts/index.hbs'), 
  })
);

app.set("view engine", ENGINE_NAME);
app.set("views", path.join(__dirname, './views')); 

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.get("/", (_req: Request, res: Response) => {
  res.sendFile("index.html", { root: path.join(__dirname, './public') });
});

ioServer.on("connection", async (socket) => {
  Utils.connectToDb();
  socket.emit("productList", await Utils.getAllProducts());
  socket.emit("messageList", await getMessages());
  socket.on("new-message", async (data) => {
    await updateMessages(data);
    ioServer.sockets.emit("messageList", await getMessages());
  });
});

app.get("/productos/vista", async (_: Request, res: Response) => {
  const data = await Utils.getAllProducts();
  res.render("main.hbs", { data });
});

///////////////////////////////////

app.get("/productos/vista-test/", async (req: Request, res: Response) => {
  const data = getProductsMock(Number(req.query.cant));
  res.render("main.hbs", { data });
});

///////////////////////////////////

router.get('/productos/listar', async (_: Request, res: Response) => {
  const products = await Utils.getAllProducts();
  res.json(products && products.length > 0 ? products : { error: 'No hay productos cargados.' });
});

router.get('/productos/listar/:id', async (req: Request, res: Response) => {
  const product = await Utils.getProductByID(req.params.id);
  res.json(product ? product : { error: 'Producto no encontrado.' } );
});

router.post('/productos/guardar', async (req: Request, res: Response) => {
  Utils.saveProduct(req.body);
  const products = await Utils.getAllProducts();
  ioServer.sockets.emit("productList", products);
  res.redirect('/');
});

router.put('/productos/actualizar/:id', async (req: Request, res: Response) => {
  const updatedProduct = await Utils.updateProduct(req.body, req.params.id);
  if (updatedProduct) {
    const products = await Utils.getAllProducts();
    ioServer.sockets.emit("productList", products);
  }
  res.send(updatedProduct ?? { error: 'Producto no encontrado.' });
});

router.delete('/productos/borrar/:id', async (req: Request, res: Response) => {
  const deletedProduct = await Utils.deleteProduct(req.params.id);
  if (deletedProduct) {
    const products = await Utils.getAllProducts();
    ioServer.sockets.emit("productList", products);
  };
  res.send(deletedProduct ?? { error: 'Producto no encontrado.' });
});