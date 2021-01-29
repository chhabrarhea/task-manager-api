const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    desc:{
        type:String,
        required:true,
        trim:true,
        minLength:1
    },completed:{
        type:Boolean,
        default:false
    },owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
        ,ref:'User'
    }
},{
    timestamps:true
})
var Task=mongoose.model('Task',schema)

module.exports=Task