const mongoose = require('mongoose')
const mongooseURI = 'mongodb://localhost:27017/user_data'

const connectToMongo = async () => {
    await mongoose.connect(mongooseURI, {
        
    })
    console.log('connected to mongodb')
}
 module.exports=connectToMongo