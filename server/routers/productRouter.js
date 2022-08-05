import Router  from "express";
const router = Router();

import multer from "multer";

const storage = multer.diskStorage({ 
    
    destination: (req, file, callback) => {
        // first argument is for error
        callback(null, 'uploads/products/');
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


// product categories
router.get("/products/categories", (req, res) => {
    connection.query("SELECT * FROM productcategories", [], async (error, results) => {
        if(error) res.send({ categoriesData: "error" });
        if(results) res.send({ categoriesData: results });
    })
});




router.post("/products", upload.single("productpicture") ,(req, res) => {  
    connection.query("INSERT INTO products (title, description, price, productpicture, category_fk, seller_fk) VALUES(?,?,?,?,?,?)", [req.body.producttitle, req.body.description, req.body.price ,req.file.path, req.body.category_fk, req.body.seller_fk], async (error, results) => {
        if(error) res.send({ createProductData: "error" });
        if(results) res.send({ createProductData: "success" });
    }) 
    
});

router.delete("/products/:productID", (req, res) => {  
    connection.query("DELETE FROM products WHERE id = ? AND seller_fk = ?", [req.params.productID, req.session.userID], async (error, results) => {  
        if(error) res.send({ deleteProductData: "error" });
        if(results) res.send({ deleteProductData: "success" }); 
    }) 
});


router.get("/products/:productID" ,(req, res) => {  
    connection.query("SELECT products.id, products.title, products.price,  products.description, products.productpicture, products.seller_fk, products.category_fk ,users.email, users.name, productcategories.categoryname FROM products JOIN users ON products.seller_fk = users.id JOIN productcategories ON products.category_fk = productcategories.id WHERE products.id = ?", [req.params.productID], async (error, results) => {
        if(error) res.send({ ProductData: "error" });
        if(results) res.send({ ProductData: results });
    })  
});

router.put("/products/:productID" ,(req, res) => {
    connection.query("UPDATE products SET title = ?, description = ?, price = ?, category_fk = ? WHERE id = ? AND seller_fk = ?", [req.body.title, req.body.description, req.body.price, req.body.category_fk, req.params.productID, req.body.seller_fk], async (error, results) => {
        if(error) res.send({ updateProductData: "error" });
        if(results) res.send({ updateProductData: "success" });
    })
});

router.put("/products/:productID/productpicture", upload.single("productpicture") ,(req, res) => {   
    connection.query("UPDATE products SET productpicture = ? WHERE id = ?", [req.file.path, req.params.productID], async (error, results) => {
        if(error) res.send({ updateProductImageData: "error" });
        if(results) res.send({ updateProductImageData: "success" });
    }) 
});






// Myproducts
router.get("/products/users/:userID" ,(req, res) => {  
    connection.query("SELECT id, title, price, productpicture FROM products WHERE seller_fk = ?", [req.params.userID], async (error, results) => {
        if(error) res.send({ myProductsData: "error" });
        if(results) res.send({ myProductsData: results });
    }) 
});




export default router;