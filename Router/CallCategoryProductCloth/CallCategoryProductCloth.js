const express = require('express')
const { ObjectId } = require('mongodb')

// AllClothProductCategoryWorkThere

module.exports = ({ AllCategoryProductCollection, AllClothCategoryCollection, AllCartProductCollection, AllUserOrderCollection }) => {
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

        let existingUser = findMyData?.find(myCloth => myCloth?.ProductCode === Cloth?.ProductCode)
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


    // ========================================================================================================
    // User (Order Send) DEtails Save to Database !!
    // =====================================================

    // Admin (get all) user (order) data 
    // ========================================
    router.get("/UserAllOrderDataGet", async (req, res) => {
        let result = await AllUserOrderCollection.find().toArray()
        res.send(result)
    })
    // My (order single data) get by order Id
    // ========================================
    router.get("/FindMyOrderHistory/:OrderId", async (req, res) => {
        let OrderID = req.params.OrderId
        let query = { OrderId: OrderID }
        let result = await AllUserOrderCollection.findOne(query)
        res.send(result)
    })
    // My (order all data) get by user email
    // ========================================
    router.get("/MyAllOrderProduct/:email", async (req, res) => {
        let MyEmail = req.params.email
        console.log(MyEmail)
        let query = { OrderEmail: MyEmail }
        let result = await AllUserOrderCollection.find(query).toArray()
        res.send(result)
    })
    // (Order product) post add to database
    // ========================================
    router.post("/UserOrderDataPost", async (req, res) => {
        let UseOrder = req.body
        let result = await AllUserOrderCollection.insertOne(UseOrder)
        res.send(result)
    })
    //  User all (cart product delete) after payment request !!
    // ===========================================================
    router.delete("/DeleteAllCartProductAfterPayment", async (req, res) => {
        let AllIds = req.body

        if (AllIds.length === 0) {
            return res.status(400).send({ message: "No IDs Provided" });
        }

        // Convert string IDs → MongoDB ObjectId
        const formattedIds = AllIds.map(id => new ObjectId(id));
        const query = { _id: { $in: formattedIds } };

        let result = await AllCartProductCollection.deleteMany(query)
        res.send(result)
    })
















    return router
}