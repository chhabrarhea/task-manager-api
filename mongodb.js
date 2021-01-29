const mongo=require('mongodb')
const mongoClient=mongo.MongoClient
const ObjectId=mongo.ObjectID

const databaseName='task-manager'
const connectionURL='mongodb://127.0.0.1:27017'

mongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect')
    }
      const db=client.db(databaseName)

    //////////////////writing data//////////////////////////////////
    //   db.collection('users').insertOne({
    //       name:'Rhea',
    //       age:27
    //   },(error,result)=>{
    //       if(error){
    //          return console.log('Error insserting data')
    //       }
    //       console.log(result.ops)
    //   })
     
    //   db.collection('users').insertMany([{name:'Riya',age:28},{name:'Ria',age:29}],(error,result)=>{
    //       if(error)
    //       return console.log('Unable to insert')
    //       console.log(result.ops)
    //   })
    //   db.collection('tasks').insertMany([{desc:'learning nodejs',completed:true},{desc:'leetcode',completed:false},{desc:'exercise',completed:false}],(error,result)=>{
    //     if(error)
    //     return console.log('Unable to insert')
    //     console.log(result.ops)
    // })



////////////////////////READING DATA////////////////////////////////////////////////////
// db.collection('users').findOne({_id:new ObjectId("600a536e8d7f2848486ec65b")},(error,user)=>{
//     if(error)
//     return console.log('Unable to find!')
//     if(user===null){
//         return console.log('No matched results!')
//     }
//     console.log(user)
// })

//find returns a cursor 
// db.collection('users').find({age:27}).toArray((error,user)=>{
//     if(error)
//     return console.log('Unable to find!')
//     if(user===null){
//         return console.log('No matched results!')
//     }
//     console.log(user)
// })
// db.collection('users').find({age:27}).count((error,count)=>{
//     if(error)
//     return console.log('Unable to find!')
//     console.log(count)
// })



/////////////////UPDATING DATA/////////////////////////////////////

// db.collection('tasks').updateMany({completed:false},{
//     $set:{
//         completed:true
//     }
// }).then((result)=>{
//     console.log(result.modifiedCount)
// }).catch((error)=>{
//     console.log('error',error)
// })

// db.collection('users').updateOne({age:28},{$inc:{age:-1}}).then((result)=>{
//     console.log(result.modifiedCount)
// }).catch((error)=>{
//     console.log('error',error)})



///////////////////////////DELETING DATA////////////////////////////////////////////

db.collection('users').deleteMany({age:29}).then((result)=>{
    console.log(result.deletedCount)
}).catch((error)=>{
    console.log('error',error)
})
})