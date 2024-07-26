const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')
const swaggerui = require('swagger-ui-express')
const swaggerjsdoc = require("swagger-jsdoc")
app.use(express.json())

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

const options = {
    definition:{
        openapi :"3.0.0",
        info:{
            title: "To Do List Swagger",
            version:"1.0.0"
        },
        servers:[{
            url:"http://localhost:8080"
        }]
    },
    apis:['./routes/registration.route.js']
}

const swaggerspec = swaggerjsdoc(options)
app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerspec))

const route1 = require('./routes/registration.route')
app.use(route1)
const route2 = require('./routes/task.route')
app.use(route2)


const port = process.env.PORT
app.listen(port, ()=>{
    console.log("server is running at port"+" "+port)
})