const { mode } = require('uuid-mongodb')
const model = require('../model/registration.model')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const nodemailer = require('nodemailer')
const juice = require('juice')
const jwt = require('jsonwebtoken')



exports.register_user = async(req,res,next) =>{
    try{
        const new_user = await model.register_user(req.body)
        if(new_user == null){
            res.status(400).send({
                message: "email already exists"
            })
        }
        else{
            res.status(201).send({
                message:"user added successfully",
                // message:new_user
            })
        }

    }
    catch(err){
        res.status(400).send({
            message:err.message
        })

    }
}

exports.get_user = async(req,res,next) =>{

    try{
        const get_user = await model.get_existuser(req.body)
        if(get_user == null){
            res.status(400).send({
                message:"invalid email or password"
            })
        }
        else{

            const token = jwt.sign({
                userId:get_user._id,
                username: get_user.username,
                email: get_user.email,
                password: get_user.password
            },"TO_DO_LIST_SIGNATURE_8181818",{expiresIn:"2h"})

            const query_email = 'queries@todolist@gmail.com'
            const html = pug.renderFile(path.join(__dirname,'../views','Alertmail.body.pug'),{email:query_email,username:get_user.username})
            const inLined_html = juice(html)
            const transpoter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD,
                }
            })

            const mailcontent = {
                from:process.env.MAIL_ID,
                to:get_user.email,
                subject:"Login Alert Notification",
                html:inLined_html,
               
            }

            transpoter.sendMail(mailcontent,(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log("alert mail send successfully")
                }    
            })
            res.status(200).send({ 
                message: "Hi..."+" "+get_user.username+" "+ "you logged in successfully",
                token:token
            })   

          
        }

    }
    catch(err){
        res.status(400).send({
            message:err.message
        })
    }
}

exports.update_user = async(req,res,next) =>{
    try{
        const update_password = await model.update_password(req.body)
        if(update_password != null){
            res.status(200).send({
                message: "update password successfully, Relogin with the new password"
            })
        }
        else{
            res.send({
                message: "entered email is not exists "
            })
        }

    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
}

exports.users_all_data = async(req,res,next) =>{
    try{

        const userId = req.params.id
        const user_data = await model.get_user_data(userId)
        res.status(200).send({
            message: user_data
        })

    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
}