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

import connection from "../database/createMySQLConnection.js"

import { authLimiter, isLoggedIn } from "../authorization/authorization.js"

// GET
// selects all products except the user products
// Search by name
router.get("/products", [isLoggedIn], (req, res) => {
    //if req.query.title is undefined
    if(!req.query.title) {
        req.query.title = "";
    }
    try {
        connection.query("SELECT id, title, price, productpicture FROM products WHERE title LIKE ? AND NOT seller_fk = ?", [req.query.title+"%", req.session.userID], async (error, results) => {
            if(error) res.send({ productsData: "error" });
            if(results) res.send({ productsData: results });
        }) 
    } catch (error) {
        res.send({ productsData: "error" });
    }
});

// GET
// selects a product
router.get("/products/:product_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT products.id, products.title, products.price,  products.description, products.productpicture, products.seller_fk, products.category_fk, products.active ,users.email, users.name, productcategories.categoryname FROM products JOIN users ON products.seller_fk = users.id JOIN productcategories ON products.category_fk = productcategories.id WHERE products.id = ?", [req.params.product_id], async (error, results) => {
            if(error) res.send({ ProductData: "error" });
            if(results) res.send({ ProductData: results });
        }) 
    } catch (error) {
        res.send({ ProductData: "error" });
    }
});


//POST
// Creates a product
router.post("/products", [upload.single("productpicture"), isLoggedIn] ,(req, res) => {
    try {
        connection.query("INSERT INTO products (title, description, price, productpicture, category_fk, seller_fk) VALUES(?,?,?,?,?,?)", [req.body.producttitle, req.body.description, req.body.price ,req.file.path, req.body.category_fk, req.body.seller_fk], async (error, results) => {
            if(error) res.send({ createProductData: "error" });
            if(results) res.send({ createProductData: "success" });
        })
    } catch (error) {
        res.send({ createProductData: "error" });
    }  
});

// DELETE
// Deletes a product
router.delete("/products/:product_id", [isLoggedIn, authLimiter], (req, res) => {
    try {
        connection.query("DELETE FROM products WHERE id = ? AND seller_fk = ?", [req.params.product_id, req.session.userID], async (error, results) => {  
            if(error) res.send({ deleteProductData: "error" });
            if(results) res.send({ deleteProductData: "success" }); 
        }) 
    } catch (error) {
        res.send({ deleteProductData: "error" });
    }  
});

//PUT
//Updates a product
router.put("/products/:product_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("UPDATE products SET title = ?, description = ?, price = ?, category_fk = ? WHERE id = ? AND seller_fk = ?", [req.body.title, req.body.description, req.body.price, req.body.category_fk, req.params.product_id, req.session.userID], async (error, results) => {
            if(error) res.send({ updateProductData: "error" });
            if(results) res.send({ updateProductData: "success" });
        })
    } catch (error) {
        res.send({ updateProductData: "error" });
    }
});

// PUT
//Updates a products productpicture
router.put("/products/:product_id/productpicture", [upload.single("productpicture"), isLoggedIn] ,(req, res) => {
    try {
        connection.query("UPDATE products SET productpicture = ? WHERE id = ? AND seller_fk = ?", [req.file.path, req.params.product_id, req.session.userID], async (error, results) => {
            if(error) res.send({ updateProductImageData: "error" });
            if(results) res.send({ updateProductImageData: "success" });
        }) 
    } catch (error) {
        res.send({ updateProductImageData: "error" });
    }   
    
});

// GET
// sort by category_id
router.get("/products/sort/:category_id", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT id, title, price, productpicture FROM products WHERE category_fk = ? AND NOT seller_fk = ?", [req.params.category_id, req.session.userID], async (error, results) => {
            if(error) res.send({ productsData: "error" });
            if(results) res.send({ productsData: results });
        }) 
    } catch (error) {
        res.send({ productsData: "error" });
    }
});


// GET
// Shows the products of a specific user
router.get("/products/users/:user_id", [isLoggedIn] ,(req, res) => {
    try {
        connection.query("SELECT id, title, price, productpicture FROM products WHERE seller_fk = ?", [req.session.userID], async (error, results) => {
            if(error) res.send({ myProductsData: "error" });
            if(results) res.send({ myProductsData: results });
        }) 
    } catch (error) {
        res.send({ myProductsData: "error" });
    }
});


//GET
// Shows a receipt for a specific product
router.get("/products/:product_id/receipt", [isLoggedIn] ,(req, res) => {
    try {
        connection.query("SELECT seller.email as sellerEmail, seller.name as sellerName, seller.id as sellerID, buyer.email as buyerEmail, buyer.name as buyerName, buyer.id as buyerID, products.id as productID, products.title as productTitle, products.description as productDescription, products.price as productPrice, products.productpicture as productImg, productcategories.categoryname as productCategory FROM productreceipts JOIN users as seller ON productreceipts.seller_fk = seller.id JOIN users as buyer ON productreceipts.buyer_fk = buyer.id JOIN products ON productreceipts.product_fk = products.id JOIN productcategories ON products.category_fk = productcategories.id WHERE products.id = ?", [req.params.product_id], async (error, results) => {
            if(error) res.send({ productReceiptData: "error" });
            if(results) res.send({ productReceiptData: results });
        }) 
    } catch (error) {
        res.send({ productReceiptData: "error" });
    }
});

//Post
//Buy product / receipt
router.post("/products/:product_id/receipts", [isLoggedIn] ,(req, res) => {
    try {
        connection.query("INSERT INTO productreceipts (product_fk, seller_fk, buyer_fk) VALUES(?,?,?)", [req.params.product_id, req.session.userID, req.body.buyer_fk], async (error, results) => {
            if(error) res.send({ buyProductData: "error" });
            if(results) {
                connection.query("UPDATE products SET active = false WHERE id = ?", [req.params.productID], async (error, results) => {
                    if(error) res.send({ buyProductData: "error" });
                    if(results) res.send({ buyProductData: "success" });
                })         
            }
        }) 
    } catch (error) {
        res.send({ buyProductData: "error" });
    }
});

//GET
// product categories
router.get("/productCategories", [isLoggedIn], (req, res) => {
    try {
        connection.query("SELECT * FROM productcategories", [], async (error, results) => {
            if(error) res.send({ categoriesData: "error" });
            if(results) res.send({ categoriesData: results });
        }) 
    } catch (error) {
        res.send({ categoriesData: "error" });
    }
});

export default router;