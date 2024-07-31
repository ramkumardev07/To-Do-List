const { mode } = require('uuid-mongodb')
const model = require('../model/task.model')
const jwt = require("jsonwebtoken")
const multer = require('multer')
const dropbox = require("dropbox").Dropbox
const path = require('path')
const fs = require('fs')
exports.add_task_with_img = async(req,res,next) =>{
    try{

        const location = multer.diskStorage({
            destination:function(req,file,cb){
                cb(null,'imagetask')
            },
            filename:function(req,file,cb){
                cb(null,file.originalname)
            }
        })
        let upload = multer({
            storage: location
        }).single("file")
        
        upload(req,res,async function(err){

            const fileName = req.file.originalname
            const data = JSON.parse(req.body.data);
            const dbx = new dropbox({
                accessToken:"your access token"
            })

            const dropbox_path =  `/To-Do-List files/${fileName}`
            const filecontent = fs.readFileSync(path.join(__dirname,'../imagetask',fileName))

            const response = dbx.filesUpload({
                path:dropbox_path,
                contents:filecontent,
                mode:{".tag":"add"}
            })
            .then(response=>{
                return response
            })
            .catch(err =>{
                console.log(err)
            })

            //use the return data to get the image url
            const fileinfo = await response
            //function to get image url
            const imageurl = async (dropboxFilepath) =>{
                const response = await dbx.filesGetTemporaryLink({path: dropboxFilepath})
                const fileUrl = response.result.link
                return fileUrl
            }
            const imageUrl = await imageurl(fileinfo.result.path_display)

            const userId = req.params.id
            const addtask = await model.addnew_task(data,userId,imageUrl)
            if(addtask.modifiedCount == 1 ){
            fs.unlink(path.join(__dirname,'../imagetask',fileName), (err) => {
                if (err) throw err;
                console.log('file was deleted from local');
              });
            res.status(200).send({
                // message:addtask
                messag:"task added successfully"
            })
            }
            else{
                res.status(400).send({
                    message: "no task added"
                })
            }

        })
      

    }
    catch(err){
        res.status(400).send({
            message:err.message
        })
    }
}

exports.add_task = async (req,res,next) =>{
    try{
        const userId = req.params.id
            const addtask = await model.addnew_task(req.body,userId)
            res.status(200).send({
                message:addtask
                // messag:"task added successfully"
            })

    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
}

exports.get_particular_task = async(req,res,next) =>{

    try{
    const taskId = req.params.id
    const gettask = await model.particular_task(taskId)
    if(gettask != null){
        res.status(200).send({
            message:gettask
        })
    }
    else{
        res.send({
            message: "task not found"
        })
    }

    }
    catch(err){
        res.status(400).send({
            message:err.message
        })
    }

}

exports.get_all_task = async(req,res,next) =>{

    try{
    const userId = req.params.id
    const head_token = req.headers.authorization.split(" ")[1]
    const verify_token = jwt.verify(head_token,"TO_DO_LIST_SIGNATURE_8181818")

    if(verify_token.userId == userId){
        const gettask = await model.all_task(userId)
        if(gettask != null){
            res.status(200).send({
                message:gettask
            })
        }
        else{
            res.send({
                message: "task not found"
            })
        }
    
        }
        else{
            res.status(400).send({
                message: "user not match"
            })
        }
    }


    catch(err){
        res.status(400).send({
            message:err.message
        })
    }

}


exports.update_task = async(req,res,next) =>{

    try{

        const update_task = await model.update_task(req.body,req.params)
        if(update_task.modifiedCount == 1 ){

            res.status(200).send({
                message: "update successfully"
            })
    
        }
        else{
            res.send({
                message: "update unsuccesfull !!"
            })
        }
    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
}