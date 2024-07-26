const express = require('express')
const app = express()
const validate = require('../routes/valiadate')
const {register_user,get_user,update_user,users_all_data} = require('../controllers/registration.controller')

app.post('/signIn',validate,register_user)
app.get('/signUp',get_user)
app.put('/updateUser',update_user)
app.get('/:id',users_all_data)

module.exports = app
