const express = require('express')
const app = express()
const validate = require('../routes/valiadate')
const {register_user,get_user,update_user,users_all_data} = require('../controllers/registration.controller')

/**
 * @swagger
 * /signIn:
 *   post:
 *     summary: API for user to register the details
 *     description: User enters their username, email, and password to create an account in To Do List
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

app.post('/signIn',validate,register_user)

/**
 * @swagger
 * /signUp:
 *   get:
 *     summary: API for user to login with registered details
 *     description: User enters their  email, and password to login into their registered account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 */
app.get('/signUp',get_user)
app.put('/updateUser',update_user)
app.get('/:id',users_all_data)

module.exports = app