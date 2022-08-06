import db from "./createMySQLConnection.js";

const deleteMode = false;

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

// Seed for Events
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

// Seed for Events invites
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS events_invites")
}

db.query(`
CREATE TABLE IF NOT EXISTS events_invites(
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_fk INT,
    user_fk INT,
    status VARCHAR(50) DEFAULT 'Invited'
)
`);

// Seed for Events posts
if (!deleteMode) {
    db.query("DROP TABLE IF EXISTS events_posts")
}

db.query(`
CREATE TABLE IF NOT EXISTS events_posts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_fk INT,
    text VARCHAR(255),
    date VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
)
`);

// Seed for products
if (!deleteMode) {
    db.query("DROP TABLE IF EXISTS products")
}

db.query(`
CREATE TABLE IF NOT EXISTS products(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150),
    description VARCHAR(60),
    price VARCHAR(60),
    productpicture VARCHAR(255),
    category_fk INT,
    seller_fk INT,
    active BOOLEAN DEFAULT true
)
`);

// Seed for product categories
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS productcategories")
}

db.query(`
CREATE TABLE IF NOT EXISTS productcategories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoryname VARCHAR(100)
)
`);

if (deleteMode) {
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Vehicles")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Clothing")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Electronics")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Entertainment")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Family")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Garden")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Hobbies")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Musical Instruments")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Sports")`);
    db.query(`INSERT INTO productcategories (categoryname) VALUES ("Games & Toys")`);
}


// Seed for product receipts
if (deleteMode) {
    db.query("DROP TABLE IF EXISTS productreceipts")
}

db.query(`
CREATE TABLE IF NOT EXISTS productreceipts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_fk INT,
    seller_fk INT,
    buyer_fk INT
)
`);