import Router  from "express";
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


router.get("/users/", (req, res) => {    
    connection.query("SELECT id, name, profilepicture FROM users WHERE NOT id = ?", [req.session.userID] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ data: results });
    })
});

router.get("/users/:userID", (req, res) => {    
    connection.query("SELECT email, name, profilepicture FROM users WHERE id = ?", [req.params.userID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ data: results });
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
            if(results.length == 0) {
                res.send({ status: false });
            } else {
                res.send({ status: true });
            }
        }
    })
});








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
                res.send({ id: results[0].id });
            } 
            // if the password does not match with the user
            if (!isSame) res.sendStatus(404);
        }
    })
});



export default router;