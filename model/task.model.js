const dbo = require('../database')
const { Timestamp } = require('mongodb')
const uuid = require('uuid-mongodb')

async function Db (){
    const database = await dbo.getdatabase()
    return database

}


exports.addnew_task = async(userdata,id,imageurl) =>{

    const database = await Db()
    const user_task = await database.collection('user_task')
    const taskId = uuid.v1();

    const addnew_task = await user_task.updateOne({userId:id},{$addToSet:{
        task_list:{
            task_id:taskId.toString('N'),
            task_title:userdata.title,
            task_description:userdata.description,
            task_image:imageurl,
            task_date:userdata.date,
            task_time:userdata.time,
            task_added_date:new Date(),
            task_added_time: new Timestamp()

        }
    }})
    return addnew_task

}

exports.particular_task = async(taskId) =>{

    const database = await Db()
    const user_task = await database.collection('user_task')
    const task = await user_task.findOne(
        { "task_list.task_id": taskId },
        { projection: { task_list: { $elemMatch: { task_id: taskId } } } })
    if(task != null){
        return task
    }
    else{
        return null
    }
}

exports.all_task = async(userid) =>{

    const database = await Db()
    const user_task = await database.collection('user_task')

    const all_task = await user_task.find({userId:userid})
    if(all_task != null){
        const cursor = await all_task.toArray()
        return cursor
    }
    else{
        return null
    }
}

exports.update_task = async(taskdata,taskid) =>{

    const database = await Db()
    const user_task = await database.collection('user_task')
    const updated_task = await user_task.updateOne({"task_list.task_id":taskid.id},{$set:{

        task_list:[{

            task_id:taskid.id,
            task_title:taskdata.title,
            task_description:taskdata.description,
            task_date:taskdata.date,
            task_time:taskdata.time,
            task_updated_date:new Date(),
            task_updated_time: new Timestamp()

        }]

    }})
    return updated_task
}