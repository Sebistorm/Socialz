import Router  from "express";
const router = Router();

import connection from "../database/createMySQLConnection.js"


router.post("/events/", (req, res) => {    
    console.log(req.body);
    console.log(req.session.userID);
    connection.query("INSERT INTO events (title, description, date, createdby_fk) VALUES(?,?,?,?)", [req.body.title, req.body.description, req.body.date, req.body.createdby_fk] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});

router.get("/events/:eventID", (req, res) => {    
    connection.query("SELECT * from events WHERE id = ?", [req.params.eventID] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ eventData: results });
    })
});

router.put("/events", (req, res) => {    
    connection.query("UPDATE events SET title = ?, date = ?, description = ? WHERE id = ?", [req.body.title, req.body.date, req.body.description, req.body.id ] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});

router.delete("/events/:eventID", (req, res) => {    
    connection.query("DELETE FROM events WHERE id = ? AND createdby_fk = ?", [req.params.eventID, req.session.userID], (error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.sendStatus(200);
    })
});




export default router;