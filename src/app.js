import express from 'express';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js'
import UserRouter from "./routers/user.router.js";
import AuthRouter from "./routers/auth.router.js";
import {viewsRouter} from './routers/views.router.js';
import dotenv from 'dotenv';
import "./config/db.js";
import cookie from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
app.use(cookie());
app.use(
  session({
    store: new mongoStore({
      mongoUrl: process.env.MONGO_URI,
      options: {
        userNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 100000 },
  }),
);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');


app.use((req, _res, next) => { //https://aaryanadil.com/pass-socket-io-to-express-routes-in-files/ 
    req.io = io;
    next();
});
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use("/api/users", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/", viewsRouter);
app.use("/pagination", viewsRouter)

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => { 
console.log(`🚀 Server started on port http://localhost:${PORT}`)});
server.on('error', (err) => console.log(err));


const io = new Server(server)

io.on('connection', (socket) => {
    console.log(`Nueva conexion desde el id: ${socket.id}`);

    socket.on('disconnect', (_socket) => {
        console.log(`Cierre de conexion`);
    })
})

const socketServer = new Server(server);

const messages = [];
socketServer.on("connection", (socket) => {
  console.log("Nueva conexión");
  socket.emit("Welcome", { welcome: "Chat web", messages });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  socket.on("message", (data) => {
    console.log("Servidor:", data);
    messages.push(data);
    socketServer.emit("message", data);
  });

  socket.on("newUser", (nombre) => {
    socket.broadcast.emit("newUser", nombre);
  });
});
