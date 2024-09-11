require('dotenv').config()
const mongoose = require('mongoose')
const mongooseURI = process.env.MONGODB_CONNECTION

const connectToMongo = async () => {
    await mongoose.connect(mongooseURI, {
        
    })
    console.log('connected to mongodb')
}
 module.exports=connectToMongo