import express from "express";
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import productsRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import mongoose from "mongoose";

const PORT = 8080;

const MONGO = "mongodb+srv://juulidangelo:by90rXt4IAZkXKPY@pruebas.pav46y5.mongodb.net/?retryWrites=true&w=majority"

const app = express();

const enviroment = async () => {
    await mongoose.connect(MONGO);
}

enviroment();

app.use(express.json()); // para recibir correctamente el req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const server = app.listen(PORT, () => { console.log(`Servidor escuchando en el puerto: ${PORT}`) })

app.use("/", viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter)

export const io = new Server(server);

io.on("connection", socket => {
    console.log("usuario conectado");
})

