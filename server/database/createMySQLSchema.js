import db from "./createMySQLConnection.js";

const deleteMode = true;

// Seed for users
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS users")
}

db.query(`
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) UNIQUE,
    name VARCHAR(60),
    password VARCHAR(60),
    profilepicture VARCHAR(155) DEFAULT 'uploads/ano-user.png'
)
`);

if (deleteMode) {
    db.query(`INSERT INTO users (email, name, password) VALUES ("a@gmail.com", 'CustomerA', '$2b$12$9yx5V7pkxGJinWMGsqt4QOEZuuSX1uDI2Me.uzQlxfQhhHHP3SAbC')`);
    db.query(`INSERT INTO users (email, name, password) VALUES ("b@gmail.com", 'CustomerB', '$2b$12$9yx5V7pkxGJinWMGsqt4QOEZuuSX1uDI2Me.uzQlxfQhhHHP3SAbC')`);
    db.query(`INSERT INTO users (email, name, password) VALUES ("c@gmail.com", 'CustomerC', '$2b$12$9yx5V7pkxGJinWMGsqt4QOEZuuSX1uDI2Me.uzQlxfQhhHHP3SAbC')`);
}

// Seed for follows
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS follows")
}

db.query(`
CREATE TABLE IF NOT EXISTS follows(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_fk INT,
    following_fk INT
)
`);