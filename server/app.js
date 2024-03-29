import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

app.use(express.json());

import helmet from "helmet";
app.use('/', helmet());

import path from "path";
app.use("/uploads", express.static("uploads")); 


import session from "express-session"
app.use(session({
    secret: process.env.SECRET_STRING,
    resave: false,
    saveUninitialized: false
}));

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);


let count = 0; 

io.on("connection", (socket) => {
    socket.on("userLoggedIn", ( userid ) => {
        console.log("user logged in: " + userid);
        count++
        socket.broadcast.emit("userOnline", count);
        
    });   

    socket.on('create', (sendersID) => {
        io.socketsLeave(sendersID);
        socket.join(sendersID);
    });

    socket.on("messageSent", (msg, anotherSocketId) => {
        socket.to(anotherSocketId).emit("privateMessage", msg);   
    }); 

    socket.on("logout", () => {
        count--; 
        socket.broadcast.emit("userOnline", count);
    }); 

}); 


import userRouter from "./routers/userRouter.js";
app.use(userRouter);

import eventRouter from "./routers/eventRouter.js";
app.use(eventRouter);

import productRouter from "./routers/productRouter.js";
app.use(productRouter); 

import postRouter from "./routers/postRouter.js";
app.use(postRouter); 

import testRouter from "./routers/testRouter.js";
app.use(testRouter);

app.use(express.static(path.resolve("../client/public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server is running on port", PORT)
})