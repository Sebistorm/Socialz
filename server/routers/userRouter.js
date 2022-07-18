import Router  from "express";
const router = Router();

import bcrypt from "bcrypt";

import connection from "../database/createMySQLConnection.js"

import { authLimiter } from "../authorization/authorization.js"




router.get("/users/:id", (req, res) => {    
    connection.query("SELECT email, name, profilepicture FROM users WHERE id = ?", [req.params.id], function (error, results) {
        if(error) res.sendStatus(404);
        if(results) res.send({ data: results });
    })
});

router.put("/users/:id", (req, res) => {    
    connection.query({
        sql:"UPDATE users SET email = ?, name = ? WHERE id = ?",
        values: [req.body.email, req.body.name, req.params.id]
    }, async (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    }) 
});

router.delete("/users/:id", (req, res) => {    
    connection.query("DELETE FROM users WHERE id = ?", [req.params.id], function (error, results) {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});

router.post("/users", authLimiter , async (req,res) => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    connection.query({
        sql:"INSERT INTO users (email, name, password) VALUES(?,?,?)",
        values: [req.body.email, req.body.name, hashedPassword]
    }, async (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    });           
});


router.post("/users/login", (req, res) => {
    connection.query("SELECT * FROM users WHERE email = ?", [req.body.email], async function (error, results) {
        if(error) res.sendStatus(404);
        if(results) {
            const isSame = await bcrypt.compare(req.body.password, results[0].password);
            if (isSame) {
                req.session.isLoggedIn = true;
                res.send({ id: results[0].id });
            } 
            // if the password does not match with the user
            if (!isSame) res.sendStatus(404);
        }
    })
});



export default router;