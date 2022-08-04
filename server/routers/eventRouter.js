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


// Event's Users
router.get("/events/:eventID/users", (req, res) => {    
    connection.query("SELECT users.id, users.name, users.profilepicture, events_invites.status from users JOIN events_invites ON users.id = events_invites.user_fk WHERE event_fk = ?", [req.params.eventID] ,(error, results) => {
        if(error) res.sendStatus(404);
        if(results) res.send({ invitedPeopleData: results });
    })
});

router.put("/events/:eventID/users/:userID", (req, res) => {
    connection.query("UPDATE events_invites SET status = ? WHERE event_fk = ? AND user_fk = ?", [req.body.status, req.params.eventID, req.params.userID] ,(error, results) => {
        if(error) res.send({ changeStatusData: "error" });
        if(results) res.send({ changeStatusData: "success" });
    })
});


// event's users count for each status (attending, Maybe, invited, not going)
router.get("/events/:eventID/users/count", (req, res) => {  
    connection.query("select count(*) as total_count, count(if(status='Attending',1,null)) as Attending_count, count(if(status='Invited',1,null)) as Invited_count, count(if(status='Not Attending',1,null)) as Not_Attending_count,count(if(status='Maybe Attending',1,null)) as Maybe_Attending_count from events_invites WHERE event_fk = ?", [req.params.eventID] ,(error, results) => {
        if(error) res.send({ eventAttendingCountData: "error" });
        if(results) res.send({ eventAttendingCountData: results });
    })
});


// invite people section
router.get("/events/:eventID/invite", (req, res) => { 
    connection.query("Select * from users where id IN (select user_fk from follows where following_fk = ?) AND NOT id IN (select user_fk from events_invites where event_fk = ?) AND NOT id = ?", [req.session.userID, req.params.eventID, req.session.userID] ,(error, results) => {
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


// event's posts
router.post("/events/:eventID/posts", (req, res) => {
    connection.query("INSERT INTO events_posts (event_fk, text) VALUES(?,?)", [req.params.eventID, req.body.eventPostText] ,(error, results) => {
        if(error) res.send({ eventPostData: "error" });
        if(results) res.send({ eventPostData: "success" });
    })
});

router.get("/events/:eventID/posts", (req, res) => {
    connection.query("SELECT * from events_posts WHERE event_fk = ? order by date desc", [req.params.eventID] ,(error, results) => {
        if(error) res.send({ eventPostsData: "error" });
        if(results) res.send({ eventPostsData: results });
    })
});




export default router;