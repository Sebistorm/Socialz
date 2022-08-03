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


router.get("/events/:eventID/users", (req, res) => {    
    connection.query("SELECT users.id, users.name, users.profilepicture from users JOIN events_invites ON users.id = events_invites.user_fk WHERE event_fk = ?", [req.params.eventID] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ invitedPeopleData: results });
    })
});


// invite people section
router.get("/events/:eventID/invite", (req, res) => { 
    let userIds = [];
    req.query.users.split(",").forEach(number => {
        userIds.push(Number(number))
    });
    connection.query("SELECT id, name, profilepicture from users where id IN (select user_fk from follows where following_fk = ?) AND NOT id IN (select user_fk from events_invites where user_fk IN (?)) AND NOT id = ?", [req.session.userID, userIds, req.session.userID] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ peopleToInviteData: results });
    })
});

router.post("/events/:eventID/invite/:userID", (req, res) => {
    connection.query("INSERT INTO events_invites (event_fk, user_fk) VALUES(?,?)", [req.params.eventID, req.params.userID] ,(error, results) => {
        if(error) res.send({ invitePeopleData: "error" });
        if(results) res.send({ invitePeopleData: "success" });
    })
});




export default router;