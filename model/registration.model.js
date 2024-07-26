const dbo = require('../database')
const bcrypt = require('bcryptjs');
const uuid = require('uuid-mongodb')
const { Timestamp } = require('mongodb')

async function Db (){
    const database = await dbo.getdatabase()
    return database

}


exports.register_user = async(userdata) =>{

    const database = await Db()
    const user_detials = await database.collection('user_detials')
    const user_task = await database.collection('user_task')

    const exists_user = await user_detials.findOne({$or:[{username:userdata.username},{email:userdata.email}]})

    if(exists_user == null){

        const user_id = uuid.v1();
        const hasedpassword = bcrypt.hashSync(userdata.password,bcrypt.genSaltSync(8))

        const new_user = {
            _id:user_id.toString('N'),
            username:userdata.username,
            email:userdata.email,
            password:hasedpassword,
            resgisteredAt:new Date(),
            timeAt: new Timestamp()
        }
        const register_user = await user_detials.insertOne(new_user)
        const added_user = await user_detials.findOne({username:userdata.username})
        await user_task.insertOne({
            userId:added_user._id,
            task_list:[]
        })
        return register_user
    }
    else{
        return null
    }
    
}

exports.get_existuser = async(userdata) =>{

    const database = await Db()
    const user_detials = database.collection('user_detials')

    const get_user = await user_detials.findOne({email:userdata.email})

    if(get_user != null){

        const hashed_password = get_user.password
        const decrypt_password = bcrypt.compareSync(userdata.password,hashed_password)
        
        if(decrypt_password == true){
            return get_user
        }
        else{
            return null
        }

    }
    else{
        return null
    }
}

exports.update_password = async(userdate) =>{

    const database = await Db()
    const user_detials = await database.collection('user_detials')
    const exists_user =  await user_detials.findOne({email:userdate.email})
    
    if(exists_user != null){
        const hasedpassword = bcrypt.hashSync(userdate.password,bcrypt.genSaltSync(8))
        const result= user_detials.updateOne({email:userdate.email},{$set:{
            password:hasedpassword
        }})
        return result
    }
    else{
        return null
    }
}

exports.get_user_data = async(userid) =>{

    const database = await Db()
    const user_detials = await database.collection('user_detials')

    const cursor_data = await user_detials.aggregate([
        {
            $match:
            {_id:userid}
        },
        {$lookup:
            {
            from:"user_task",
            localField:"_id",
            foreignField:"userId",
            as:'task'
            }
        }
    ])
    const user_data = await cursor_data.toArray()
    return user_data
}