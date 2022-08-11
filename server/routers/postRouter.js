import Router from "express";
const router = Router();
import connection from "../database/createMySQLConnection.js"

import { isLoggedIn } from "../authorization/authorization.js"

// GET
// SELECT all the posts the user has created or post from people which he follows
router.get("/posts/users", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT posts.*, users.name, users.profilePicture FROM users_posts AS posts INNER JOIN users AS users ON posts.user_fk = users.id WHERE posts.user_fk = ? OR posts.user_fk IN (select following_fk from follows where user_fk = ?) ORDER BY posts.date desc", [req.session.userID, req.session.userID], (error, results) => {
            if(error) res.send({usersPostsData: "error"});
            if(results) res.send({usersPostsData: results});
        })
    } catch (error) {
        res.send({usersPostsData: "error"});
    }   
}); 

// GET
// Gets all posts from the user
router.get("/posts/users/:user_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * FROM users_posts WHERE user_fk = ? order by date desc", [req.params.user_id], (error, results) => {
            if(error) res.send({userPostsData: "error"});
            if(results) res.send({userPostsData: results});
        })
    } catch (error) {
        res.send({userPostsData: "error"});
    }
});

//POST
// Post the post from the user
router.post("/posts/users/:user_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("INSERT INTO users_posts (user_fk, text) VALUES(?,?)", [req.params.user_id, req.body.userPostText], (error, results) => {
            if(error) res.send({userPostData: "error"});
            if(results) res.send({userPostData: "success"});
        })
    } catch (error) {
        res.send({userPostData: "error"});
    }
});

export default router;