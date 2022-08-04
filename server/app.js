import express from "express";
const app = express();

app.use(express.json());

import helmet from "helmet";
app.use('/', helmet());

import path from "path";
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.resolve("../client/public")));

import session from "express-session"
app.use(session({
    secret: 'den firkantet lave hund',
    resave: false,
    saveUninitialized: false
}));

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);



io.on("connection", (socket) => {
    //socket.join("room1"); 
    //console.log("one user connected: " + socket.id)
    socket.on("userLoggedIn", ( userid ) => {
        console.log("user logged in: " + userid)
       
        let msg = "kom nu!"

        
        //socket.broadcast.emit("privateMessage", { msg });
        
    }); 

    socket.on('create', (sendersID) => {
        io.socketsLeave(sendersID);
        socket.join(sendersID);
    });

    socket.on("messageSent", (msg, anotherSocketId) => {
        socket.to(anotherSocketId).emit("privateMessage", msg);   
    }) 

});


import userRouter from "./routers/userRouter.js";
app.use(userRouter);

import evnetRouter from "./routers/eventRouter.js";
app.use(evnetRouter);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server is running on port", PORT)
})