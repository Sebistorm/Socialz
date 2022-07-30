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


import userRouter from "./routers/userRouter.js";
app.use(userRouter);

import evnetRouter from "./routers/eventRouter.js";
app.use(evnetRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is running on port", PORT)
})