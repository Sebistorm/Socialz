import Router from "express";
const router = Router();

import multer from "multer";

const storage = multer.diskStorage({
    
    destination: (req, file, callback) => {
        // first argument is for error
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now().toString() + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") callback(null, true);

    callback(null, false);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

import bcrypt from "bcrypt";

import connection from "../database/createMySQLConnection.js"

import { authLimiter } from "../authorization/authorization.js"

// user post

router.get("/users/posts", (req, res) => {  
    connection.query("SELECT posts.*, users.name, users.profilePicture FROM users_posts AS posts INNER JOIN users AS users ON posts.user_fk = users.id WHERE posts.user_fk = ? OR posts.user_fk IN (select following_fk from follows where user_fk = ?) ORDER BY posts.date desc", [req.session.userID, req.session.userID], (error, results) => {
        if(error) res.send({usersPostsData: "error"});
        if(results) res.send({usersPostsData: results});
    })
}); 

router.post("/users/:userID/posts", (req, res) => {
    console.log(req.body.userPostText);
    connection.query("INSERT INTO users_posts (user_fk, text) VALUES(?,?)", [req.params.userID, req.body.userPostText], (error, results) => {
        if(error) res.send({userPostData: "error"});
        if(results) res.send({userPostData: "success"});
    })
});

router.get("/users/:userID/posts", (req, res) => {
    connection.query("SELECT * FROM users_posts WHERE user_fk = ? order by date desc", [req.params.userID], (error, results) => {
        if(error) res.send({userPostsData: "error"});
        if(results) res.send({userPostsData: results});
    })
});


router.get("/users/", (req, res) => {    
    connection.query("SELECT id, name, profilepicture FROM users WHERE NOT id = ?", [req.session.userID] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ data: results });
    })
});

router.get("/users/:userID", (req, res) => {    
    connection.query("SELECT email, name, profilepicture FROM users WHERE id = ?", [req.params.userID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ userData: results });
    })
});


router.put("/users/:userID", (req, res) => {    
    connection.query("UPDATE users SET email = ?, name = ? WHERE id = ?", [req.body.email, req.body.name, req.params.userID], async (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    }) 
});

// for profilepicture
router.patch("/users/:userID", upload.single("profilepicture") ,(req, res) => {    
    connection.query("UPDATE users SET profilepicture = ? WHERE id = ?", [req.file.path, req.params.userID], async (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    }) 
});

router.delete("/users/:userID", (req, res) => {    
    connection.query("DELETE FROM users WHERE id = ?", [req.params.userID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});




// following showcase
router.get("/users/:userID/following/showcase", (req, res) => {
    connection.query("SELECT users.name, users.profilepicture, x.count FROM follows JOIN users ON follows.following_fk = users.id, (select count(*) as count FROM follows WHERE user_fk = ?) as x WHERE follows.user_fk = ? limit 9", [req.params.userID, req.params.userID], (error, results) => {
        if(error) res.send({followingData: "error"});
        if(results) res.send({followingData: results});
    })
});

// followers showcase
router.get("/users/:userID/followers/showcase", (req, res) => {
    connection.query("select users.name, users.profilepicture, x.count FROM users JOIN follows ON users.id = follows.user_fk, (select count(*) as count FROM follows WHERE following_fk = ?) as x WHERE follows.following_fk = ? limit 9", [req.params.userID, req.params.userID], (error, results) => {
        if(error) res.send({followersData: "error"});
        if(results) res.send({followersData: results});
    })
});




// following
router.post("/users/:userID/following/:followingID", (req, res) => {
    connection.query("INSERT INTO follows (user_fk, following_fk) VALUES(?,?)", [req.params.userID, req.params.followingID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});

router.delete("/users/:userID/following/:followingID", (req, res) => {
    connection.query("DELETE FROM follows WHERE user_fk = ? AND following_fk = ?", [req.params.userID, req.params.followingID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});

router.get("/users/:userID/following/:followingID", (req, res) => {
    connection.query("SELECT * FROM follows WHERE user_fk = ? AND following_fk = ?", [req.params.userID, req.params.followingID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) {
            if(results.length === 0) {
                res.send({ status: false });
            } else {
                res.send({ status: true });
            }
        }
    })
});





// chat messages
router.post("/users/:userID/person/:personID", (req, res) => {
    connection.query("INSERT INTO chatmessages (user_fk, person_fk, chatmessage) VALUES(?,?,?)", [req.params.userID, req.params.personID, req.body.chatMessage], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});

router.get("/users/:userID/person/:personID", (req, res) => {
    connection.query("SELECT chatmessages.id, chatmessages.chatmessage, chatmessages.user_fk , users.name as personname from chatmessages JOIN users ON chatmessages.user_fk = users.id WHERE user_fk = ? AND person_fk = ? OR user_fk = ? AND person_fk = ?", [req.params.userID, req.params.personID, req.params.personID, req.params.userID], (error, results) => {
        //console.log(results)
        if(error) res.sendStatus(404);
        if(results) res.send({ chatData: results });
    })
});


// events
router.get("/users/:userID/events", (req, res) => {
    connection.query("SELECT * from events WHERE id IN (select event_fk from events_invites where user_fk = ? ) OR createdby_fk = ?", [req.params.userID, req.params.userID], (error, results) => {
        console.log(results)
        if(error) res.sendStatus(404);
        if(results) res.send({ myEventsData: results });
    })
});



//





// signup
router.post("/users", authLimiter , async (req,res) => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    connection.query("INSERT INTO users (email, name, password) VALUES(?,?,?)", [req.body.email, req.body.name, hashedPassword], async (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    });           
});

//login
router.post("/users/login", authLimiter , (req, res) => {
    connection.query("SELECT * FROM users WHERE email = ?", [req.body.email], async (error, results) => {
        if(error) res.sendStatus(404);
        if(results) {
            // TODO check password is undefined
            const isSame = await bcrypt.compare(req.body.password, results[0].password);
            if (isSame) {
                req.session.isLoggedIn = true;
                req.session.userID = results[0].id;
                res.send({ 
                    id: results[0].id,
                    name: results[0].name
                });
            } 
            // if the password does not match with the user
            if (!isSame) res.sendStatus(404);
        }
    })
});



export default router;