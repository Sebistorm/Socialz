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

import { authLimiter, isLoggedIn } from "../authorization/authorization.js"

// user post

router.get("/users/posts", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT posts.*, users.name, users.profilePicture FROM users_posts AS posts INNER JOIN users AS users ON posts.user_fk = users.id WHERE posts.user_fk = ? OR posts.user_fk IN (select following_fk from follows where user_fk = ?) ORDER BY posts.date desc", [req.session.userID, req.session.userID], (error, results) => {
            if(error) res.send({usersPostsData: "error"});
            if(results) res.send({usersPostsData: results});
        })
    } catch (error) {
        res.send({usersPostsData: "error"});
    }   
}); 

router.post("/users/:userID/posts", [isLoggedIn], (req, res) => {
    try {
        connection.query("INSERT INTO users_posts (user_fk, text) VALUES(?,?)", [req.params.userID, req.body.userPostText], (error, results) => {
            if(error) res.send({userPostData: "error"});
            if(results) res.send({userPostData: "success"});
        })
    } catch (error) {
        res.send({userPostData: "error"});
    }
});

router.get("/users/:userID/posts", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * FROM users_posts WHERE user_fk = ? order by date desc", [req.params.userID], (error, results) => {
            if(error) res.send({userPostsData: "error"});
            if(results) res.send({userPostsData: results});
        })
    } catch (error) {
        res.send({userPostsData: "error"});
    }
});


router.get("/users/", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT id, name, profilepicture FROM users WHERE NOT id = ?", [req.session.userID] ,(error, results) => {
            if(error) res.send({ usersData: "error" });
            if(results) res.send({ usersData: results });
        })
    } catch (error) {
        res.send({ usersData: "error" });
    }    
});

router.get("/users/:userID", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT email, name, profilepicture FROM users WHERE id = ?", [req.params.userID], (error, results) => {
            if(error) res.send({ userData: "error" });
            if(results) res.send({ userData: results });
        })
    } catch (error) {
        res.send({ userData: "error" });
    }    
});


router.put("/users", [isLoggedIn], (req, res) => {
    try {
        connection.query("UPDATE users SET email = ?, name = ? WHERE id = ?", [req.body.email, req.body.name, req.session.userID], async (error, results) => {
            if(error) res.send({ updateUserData: "error" });
            if(results) res.send({ updateUserData: "success" });
        }) 
    } catch (error) {
        res.send({ updateUserData: "error" });
    }
});

// for profilepicture
router.patch("/users", [upload.single("profilepicture"), isLoggedIn] ,(req, res) => {
    try {
        connection.query("UPDATE users SET profilepicture = ? WHERE id = ?", [req.file.path, req.session.userID], async (error, results) => {
            if(error) res.send({ updateUserImageData: "error" });
            if(results) res.send({ updateUserImageData: "success" });
        })
    } catch (error) {
        res.send({ updateUserImageData: "error" });
    }     
});

router.delete("/users", [isLoggedIn, authLimiter], (req, res) => {
    try {
        connection.query("DELETE FROM users WHERE id = ?", [req.session.userID], (error, results) => {
            if(error) res.send({ deleteUserData: "error" });
            if(results) res.send({ deleteUserData: "success" });
        })
    } catch (error) {
        res.send({ deleteUserData: "error" });
    }    
});




// following showcase
router.get("/users/:userID/following/showcase", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT users.name, users.profilepicture, x.count FROM follows JOIN users ON follows.following_fk = users.id, (select count(*) as count FROM follows WHERE user_fk = ?) as x WHERE follows.user_fk = ? limit 9", [req.params.userID, req.params.userID], (error, results) => {
            if(error) res.send({followingData: "error"});
            if(results) res.send({followingData: results});
        })
    } catch (error) {
        res.send({followingData: "error"});
    }
});

// followers showcase
router.get("/users/:userID/followers/showcase", [isLoggedIn], (req, res) => {
    try {
        connection.query("select users.name, users.profilepicture, x.count FROM users JOIN follows ON users.id = follows.user_fk, (select count(*) as count FROM follows WHERE following_fk = ?) as x WHERE follows.following_fk = ? limit 9", [req.params.userID, req.params.userID], (error, results) => {
            if(error) res.send({followersData: "error"});
            if(results) res.send({followersData: results});
        })
    } catch (error) {
        res.send({followersData: "error"});
    }
    
});




// following
router.post("/users/:userID/following/:followingID", [isLoggedIn], (req, res) => {
    try {
        connection.query("INSERT INTO follows (user_fk, following_fk) VALUES(?,?)", [req.session.userID, req.params.followingID], (error, results) => {
            if(error) res.send({createFollowData: "error"});
            if(results) res.send({createFollowData: "success"});
        })
    } catch (error) {
        res.send({createFollowData: "error"});
    }
});

router.delete("/users/:userID/following/:followingID", [isLoggedIn, authLimiter], (req, res) => {
    try {
        connection.query("DELETE FROM follows WHERE user_fk = ? AND following_fk = ?", [req.session.userID, req.params.followingID], (error, results) => {
            if(error) res.send({createUnFollowData: "error"});
            if(results) res.send({createUnFollowData: "success"});
        })
    } catch (error) {
        res.send({createUnFollowData: "error"});
    }
});

router.get("/users/:userID/following/:followingID", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * FROM follows WHERE user_fk = ? AND following_fk = ?", [req.params.userID, req.params.followingID], (error, results) => {
            if(error) res.send({followingStatus: "error"});
            if(results) {
                if(results.length === 0) {
                    res.send({followingStatus: false});
                } else {
                    res.send({followingStatus: true});
                }
            }
        })
    } catch (error) {
        res.send({followingStatus: "error"});
    }
    
});





// chat messages
router.post("/users/:userID/person/:personID", [isLoggedIn], (req, res) => {
    try {
        connection.query("INSERT INTO chatmessages (user_fk, person_fk, chatmessage) VALUES(?,?,?)", [req.params.userID, req.params.personID, req.body.chatMessage], (error, results) => {
            console.log(req.body);
            if(error) res.send({ userMesssageData: "error" });
            if(results) res.send({ userMesssageData: "success" });
        })
    } catch (error) {
        res.send({ userMesssageData: "error" });
    }
});

router.get("/users/:userID/person/:personID", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT chatmessages.id, chatmessages.chatmessage, chatmessages.user_fk , users.name as personname from chatmessages JOIN users ON chatmessages.user_fk = users.id WHERE user_fk = ? AND person_fk = ? OR user_fk = ? AND person_fk = ?", [req.params.userID, req.params.personID, req.params.personID, req.params.userID], (error, results) => {
            if(error) res.send({ chatData: "error" });
            if(results) res.send({ chatData: results });
        })
    } catch (error) {
        res.send({ chatData: "error" });
    }
});


// events
router.get("/users/:userID/events", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * from events WHERE id IN (select event_fk from events_invites where user_fk = ? ) OR createdby_fk = ?", [req.session.userID, req.session.userID], (error, results) => {
            console.log(results)
            if(error) res.send({ myEventsData: "error" });
            if(results) res.send({ myEventsData: results });
        })
    } catch (error) {
        res.send({ myEventsData: "error" });
    }    
});

router.get("/logout", (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                res.send({logOutData: "error"})  
            } else {
                res.send({logOutData: "success"})
            } 
        })
    } catch (error) {
        res.send({logOutData: "error"})
    }
})






// signup
router.post("/users", authLimiter , async (req,res) => {
    try {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        connection.query("INSERT INTO users (email, name, password) VALUES(?,?,?)", [req.body.email, req.body.name, hashedPassword], async (error, results) => {
            if(error) res.send({ createUserData: "error" });
            if(results) res.send({ createUserData: "success" });
        }); 
    } catch (error) {
        res.send({ createUserData: "error" });
    }     
});

//login
router.post("/users/login", authLimiter ,  (req, res) => {
    try {
        connection.query("SELECT * FROM users WHERE email = ?", [req.body.email], async (error, results) => {
            if(error) res.send({ userLoginData: error });
            if(results) {
                if(results.length > 0) {
                        const isSame = await bcrypt.compare(req.body.password, results[0].password);
                    if (isSame) {
                        req.session.isLoggedIn = true;
                        req.session.userID = results[0].id;
                        res.send({ userLoginData: {
                            results: {
                                id: results[0].id,
                                name: results[0].name
                            }, 
                            status: "success" 
                        }});
                    } else {
                        res.send({ userLoginData: "error" });
                    } 
                } else {
                    res.send({ userLoginData: "error" });
                }
            }
        })
    } catch (error) {
        res.send({ userLoginData: "error" });
    }

});



export default router;