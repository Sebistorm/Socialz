import Router from "express";
import connection from "../database/createMySQLConnection.js";

const router = Router();

router.get("/path", [], (req, res) => {
    connection.query("sqlstring", [], (error, results) => {

    })
})

export default router;