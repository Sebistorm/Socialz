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
    profilepicture VARCHAR(255) DEFAULT 'uploads/ano-user.png'
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

// Seed for chatmessages
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS chatmessages")
}

db.query(`
CREATE TABLE IF NOT EXISTS chatmessages(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_fk INT,
    person_fk INT,
    chatmessage VARCHAR(255)
)
`);

// Seed for chatmessages
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS events")
}

db.query(`
CREATE TABLE IF NOT EXISTS events(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150),
    description VARCHAR(255),
    date VARCHAR(60),
    createdby_fk INT,
    eventpicture VARCHAR(255) DEFAULT 'uploads/ano-user.png'
)
`);