require('dotenv').config()
// const { ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================
app.use(cors())
app.use(express.json())



// ===============================================================
// Database Connection
// ===============================================================

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.ENV_NAME}:${process.env.ENV_PASSWORD}@blackzone.g8pqmq7.mongodb.net/?appName=BlackZone`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // ==================================================================
        // All Database Collection Start
        // ==================================================================
        const userCollection = client.db("BlackZone").collection("users")
        const AllCategoryProductCollection = client.db("BlackZone").collection("AllCategoryProduct")
        const AllClothCategoryCollection = client.db("BlackZone").collection("ClothCategory")
        const AllCartProductCollection = client.db("BlackZone").collection("CartProduct")
        const AllUserOrderCollection = client.db("BlackZone").collection("UserOrderAll")


        // ==================================================================
        // All Router connection to bellow start
        // ==================================================================

        // All cloth product category connect bellow start
        // =================================================
        let ProductAll = require("./Router/CallCategoryProductCloth/CallCategoryProductCloth")({AllCategoryProductCollection,AllClothCategoryCollection,AllCartProductCollection,AllUserOrderCollection})
        app.use("/AllClothProductCategoryWorkThere", ProductAll)




        // ==================================================
        // Admin Panel Work  Start
        // ==================================================
        // get all user Admin Dashboard _________________
        app.get("/users", async (req, res) => {
            let result = await userCollection.find().toArray()
            res.send(result)
        })
        // SingUp user data saved Database ____________________
        app.post("/users", async (req, res) => {
            let user = req.body
            let query = { email: user.email }
            let existingUser = await userCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: "Already existing user" })
            }
            let result = await userCollection.insertOne(user)
            res.send(result)
        })
        // check user role show Dashboard _________________________________
        app.get("/userRoleCheck/:email", async (req, res) => {
            let email = req.params.email
            let query = { email: email }
            let result = await userCollection.findOne(query)
            res.send(result)
        })
        // Admin Update User Role Admin 
        // ==================================================
        app.patch("/AdminUpdateRoleAdmin/:id", async (req, res) => {
            let upId = req.params.id
            let filter = { _id: new ObjectId(upId) }
            let updateAdmin = {
                $set: {
                    role: "admin"
                }
            }
            let result = await userCollection.updateOne(filter, updateAdmin)
            res.send(result)
        })
        // Admin Update User Role User 
        // ==================================================
        app.patch("/AdminUpdateRoleUser/:id", async (req, res) => {
            let upId = req.params.id
            let filter = { _id: new ObjectId(upId) }
            let updateAdmin = {
                $set: {
                    role: "user"
                }
            }
            let result = await userCollection.updateOne(filter, updateAdmin)
            res.send(result)
        })
        // Admin Delete User 
        // ==================================================
        app.delete("/AdminDeleteUsers/:id", async (req, res) => {
            let upId = req.params.id
            let query = { _id: new ObjectId(upId) }
            let result = await userCollection.deleteOne(query)
            res.send(result)
        })


        // ==================================================================
        // All Database Code End
        // ==================================================================

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// ============================================
// Database Connect Code 
// ============================================

app.get('/', (req, res) => {
    res.send('BLACK ZONE E-commerce project is running')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});