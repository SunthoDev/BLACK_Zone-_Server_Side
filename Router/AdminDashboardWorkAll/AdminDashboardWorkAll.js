const express = require('express')
const { ObjectId } = require('mongodb')

// AdminDashboardWorkAllRoute

module.exports = ({ AllBannerCollection }) => {
    let router = express.Router()

    // =====================================================================================================
    // All Work with (Banner) Start !!
    // ====================================================
    // Get all banner of Website
    // =================================
    router.get("/AllBanner", async (req, res) => {
        let result = await AllBannerCollection.find().toArray()
        res.send(result)
    })
    // Banner data Post here
    // =================================
    router.post("/BannerPost", async (req, res) => {
        let user = req.body
        let result = await AllBannerCollection.insertOne(user)
        res.send(result)
    })
    // Admin Delete Banner Data
    // =================================
    router.delete("/BannerDelete/:id", async (req, res) => {
        let upId = req.params.id
        let query = { _id: new ObjectId(upId) }
        let result = await AllBannerCollection.deleteOne(query)
        res.send(result)
    })










    return router
}