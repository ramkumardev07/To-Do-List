const mongodb = require('mongodb')
const Mongoclient = mongodb.MongoClient

const url = process.env.DB_URL
let database
async function getdatabase(){
    const client = await Mongoclient.connect(url)
    database = client.db("To-Do-List")
    if(!database){
        console.log("database not connected")
    }
    else{
        // console.log("database connected succesfully")
        return database
    }
}

module.exports = {getdatabase}