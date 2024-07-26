const express = require('express')
const app = express()
const {add_task_with_img,add_task,get_particular_task,get_all_task,update_task} = require('../controllers/task.controller')

app.post('/addtask_img/:id',add_task_with_img)
app.post('/addtask/:id',add_task)
app.get('/task/:id',get_particular_task)
app.get('/alltask/:id',get_all_task)
app.put('/updatetask/:id',update_task)


module.exports =app