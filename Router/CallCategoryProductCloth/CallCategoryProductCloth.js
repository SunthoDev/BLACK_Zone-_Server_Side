const express = require('express')
const { ObjectId, Admin } = require('mongodb')

// AllClothProductCategoryWorkThere

module.exports = ({ AllCategoryProductCollection, AllClothCategoryCollection, AllCartProductCollection }) => {
    let router = express.Router()

    // ========================================================================================================
    // All (Cloth Product) Add and others work bellow Start !!
    // ==============================================================

    // Admin Add Cloth Product get All
    // ========================================
    router.get("/AllCategoryProduct", async (req, res) => {
        let result = await AllCategoryProductCollection.find().toArray()
        res.send(result)
    })
    // Product details get by product id 
    // ========================================
    router.get("/ProductDetails/:id", async (req, res) => {
        let id = req.params.id
        let query = { _id: new ObjectId(id) }
        let result = await AllCategoryProductCollection.findOne(query)
        res.send(result)
    })
    // Admin Add Cloth Product Dashboard 
    // ========================================
    router.post("/AdminClothProductAdd", async (req, res) => {
        let Cloth = req.body
        // console.log(Cloth)
        let result = await AllCategoryProductCollection.insertOne(Cloth)
        res.send(result)
    })
    // ========================================
    // Users cloth review send Bellow
    // ========================================
    router.put("/CustomerProductReview/:id", async (req, res) => {
        const productId = req.params.id;
        const Cloth = req.body;
        const query = { _id: new ObjectId(productId) };
        const updateDoc = {
            $push: {
                reviews: Cloth, // Add this review to the "reviews" array
            },
        };
        const options = { upsert: true };
        const result = await AllCategoryProductCollection.updateOne(query, updateDoc, options);
        res.send(result)
    })
    //  Admin Delete cloth  Product Information 
    // ========================================
    router.delete("/AdminDeleteClothProduct/:id", async (req, res) => {
        let delId = req.params.id
        let query = { _id: new ObjectId(delId) }
        let result = await AllCategoryProductCollection.deleteOne(query)
        res.send(result)
    })



    // ========================================================================================================
    // All make Product (Category) Add work bellow Start !!
    // =====================================================

    // Admin Add Cloth Category get All
    // ========================================
    router.get("/AllClothCategory", async (req, res) => {
        let result = await AllClothCategoryCollection.find().toArray()
        res.send(result)
    })
    // Product Category make Admin 
    // ================================
    router.post("/MakeClothCategory", async (req, res) => {
        let BodyData = req.body
        let query = { ClothCategoryName: BodyData.ClothCategoryName }
        let existingUser = await AllClothCategoryCollection.findOne(query)
        if (existingUser) {
            return res.send({ message: "Already existing category" })
        }
        let result = await AllClothCategoryCollection.insertOne(BodyData)
        res.send(result)
    })
    //  Admin Delete cloth category Information 
    // ============================================
    router.delete("/DeleteClothCategory/:id", async (req, res) => {
        let delId = req.params.id
        let query = { _id: new ObjectId(delId) }
        let result = await AllClothCategoryCollection.deleteOne(query)
        res.send(result)
    })



    // ========================================================================================================
    // User (Add to Cart) All Work Bellow
    // =====================================================
    // User add to cart all data get
    // ========================================
    router.get("/MyAllCartProduct/:email", async (req, res) => {
        let Email = req.params.email
        let query = { UserOrderEmail: Email }
        let result = await AllCartProductCollection.find(query).toArray()
        res.send(result)
    })
    // User product add to cart
    // ========================================
    router.post("/UserAddToCartHisProduct", async (req, res) => {
        let Cloth = req.body

        let query = { UserOrderEmail: Cloth.UserOrderEmail }
        let findMyData = await AllCartProductCollection.find(query).toArray()

        let existingUser = findMyData?.find(myCloth => myCloth?.ProductCode === Cloth?.ProductCode )
        if (existingUser) {
            return res.send({ message: "Already existing to cart" })
        }

        let result = await AllCartProductCollection.insertOne(Cloth)
        res.send(result)
    })
    //  User can delete his add to cart product 
    // ==========================================
    router.delete("/DeleteCartItem/:id", async (req, res) => {
        let delId = req.params.id
        let query = { _id: new ObjectId(delId) }
        let result = await AllCartProductCollection.deleteOne(query)
        res.send(result)
    })














    return router
}