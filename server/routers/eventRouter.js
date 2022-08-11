import Router from "express";
const router = Router();

import connection from "../database/createMySQLConnection.js"

import { authLimiter, isLoggedIn } from "../authorization/authorization.js"

//GET
// Selects an event by ID
router.get("/events/:event_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * from events WHERE id = ?", [req.params.event_id] ,(error, results) => {
            if(error) res.send({ eventData: "error" });
            if(results) res.send({ eventData: results });
        })
    } catch (error) {
        res.send({ eventData: "error" });
    }    
});

//POST
// Post a new event
router.post("/events/", [isLoggedIn] ,(req, res) => {
    try {
        connection.query("INSERT INTO events (title, description, date, createdby_fk) VALUES(?,?,?,?)", [req.body.title, req.body.description, req.body.date, req.session.userID] ,(error, results) => {
            if(error) res.send({ createEventData: "error" });
            if(results) res.send({ createEventData: "success" });
        })
    } catch (error) {
        res.send({ createEventData: "error" });
    }
});

//PUT
//Update a event by ID
router.put("/events/:event_id", [isLoggedIn], (req, res) => {   
    try {
        connection.query("UPDATE events SET title = ?, date = ?, description = ? WHERE id = ? AND createdby_fk = ?", [req.body.title, req.body.date, req.body.description, req.body.id, req.session.userID] ,(error, results) => {
            if(error) res.send({ updateEventData: "error" });
            if(results) res.send({ updateEventData: "success" });
        })
    } catch (error) {
        res.send({ updateEventData: "error" });
    }
});

//DELETE
//Delete an event by ID
router.delete("/events/:event_id", [isLoggedIn, authLimiter], (req, res) => {
    try {
        connection.query("DELETE FROM events WHERE id = ? AND createdby_fk = ?", [req.params.event_id, req.session.userID], (error, results) => {
            if(error) res.send({ deleteEventData: "error" });
            if(results) res.send({ deleteEventData: "success" });
        }) 
    } catch (error) {
        res.send({ deleteEventData: "error" });
    }
});

//GET
// SELECTS all users from a specific event
router.get("/events/:event_id/users", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT users.id, users.name, users.profilepicture, events_invites.status from users JOIN events_invites ON users.id = events_invites.user_fk WHERE event_fk = ?", [req.params.event_id] ,(error, results) => {
            if(error) res.send({ invitedPeopleData: "error" });
            if(results) res.send({ invitedPeopleData: results });
        }) 
    } catch (error) {
        res.send({ invitedPeopleData: "error" });
    }    
});

//PUT
// Update the status for a user in a specific event
router.put("/events/:event_id/users/:user_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("UPDATE events_invites SET status = ? WHERE event_fk = ? AND user_fk = ?", [req.body.status, req.params.event_id, req.params.user_id] ,(error, results) => {
            if(error) res.send({ changeStatusData: "error" });
            if(results) res.send({ changeStatusData: "success" });
        })
    } catch (error) {
        res.send({ changeStatusData: "error" });
    }
});

// GET
// event's users count for each status (attending, Maybe, invited, not going)
router.get("/events/:event_id/users/count", [isLoggedIn], (req, res) => {
    try {
        connection.query("select count(*) as total_count, count(if(status='Attending',1,null)) as Attending_count, count(if(status='Invited',1,null)) as Invited_count, count(if(status='Not Attending',1,null)) as Not_Attending_count,count(if(status='Maybe Attending',1,null)) as Maybe_Attending_count from events_invites WHERE event_fk = ?", [req.params.event_id] ,(error, results) => {
            if(error) res.send({ eventAttendingCountData: "error" });
            if(results) res.send({ eventAttendingCountData: results });
        })  
    } catch (error) {
        res.send({ eventAttendingCountData: "error" });
    }
});

//GET
// Selects all users who has been invited to the event
router.get("/events/:event_id/invite", [isLoggedIn], (req, res) => {
    try {
        connection.query("Select * from users where id IN (select user_fk from follows where following_fk = ?) AND NOT id IN (select user_fk from events_invites where event_fk = ?) AND NOT id = ?", [req.session.userID, req.params.event_id, req.session.userID] ,(error, results) => {
            if(error) res.send({ peopleToInviteData: "error" });
            if(results) res.send({ peopleToInviteData: results });
        })
    } catch (error) {
        res.send({ peopleToInviteData: "error" });
    } 
});

//POST
// invite people to event
router.post("/events/:event_id/invite/:user_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("INSERT INTO events_invites (event_fk, user_fk) VALUES(?,?)", [req.params.event_id, req.params.user_id] ,(error, results) => {
            if(error) res.send({ invitePeopleData: "error" });
            if(results) res.send({ invitePeopleData: "success" });
        }) 
    } catch (error) {
        res.send({ invitePeopleData: "error" });
    }
});

//GET
// Selects all posts from a specific event
router.get("/events/:event_id/posts", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * from events_posts WHERE event_fk = ? order by date desc", [req.params.event_id] ,(error, results) => {
            if(error) res.send({ eventPostsData: "error" });
            if(results) res.send({ eventPostsData: results });
        }) 
    } catch (error) {
        res.send({ eventPostsData: "error" });
    } 
});

//POST
// event's posts
router.post("/events/:event_id/posts", [isLoggedIn], (req, res) => {
    try {
        connection.query("INSERT INTO events_posts (event_fk, text) VALUES(?,?)", [req.params.event_id, req.body.eventPostText] ,(error, results) => {
            if(error) res.send({ eventPostData: "error" });
            if(results) res.send({ eventPostData: "success" });
        })
    } catch (error) {
        res.send({ eventPostData: "error" });
    }
});



export default router;