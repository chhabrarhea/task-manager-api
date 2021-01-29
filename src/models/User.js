const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Task=require('./Task')
const schema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    age:{
        type:Number,
        default:0
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error('invalid email')
        }},
        password:{
            type:String,
            required:true,
            trim:true,
            minLength:7,
            validate(value){
                if(value.toLowerCase().includes('password'))
                throw new Error('invalid password')
            }
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }],
        avatar:{
            type:Buffer
        }
},{
    timestamps:true
})
schema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


//encrypting passsword before saving it
schema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }
    next()
})

schema.pre('remove',async function (next){
    await Task.deleteMany({owner:this._id})
    next()
})

//logging in user
schema.statics.findByCredential=async function(email,password){
    const user=await User.findOne({email})
    if(!user){
        throw new Error('Invalid Credentials!')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    throw new Error('Invalid Credentials!')
    return user
}

    schema.methods.generateAuthToken=async function (){
      const token=jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET)
      this.tokens=this.tokens.concat({token})
      await this.save()
      return token
    }
    schema.methods.toJSON=function(){
        const userObject=this.toObject()
        delete userObject.password
        delete userObject.tokens
        return userObject
    }

    var User=mongoose.model('User',schema)
module.exports=User