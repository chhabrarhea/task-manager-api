const express=require('express')
const { findById } = require('../models/User')
const User=require('../models/User')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancellationEmail}=require('../emails/account')
const router=new express.Router()

const upload=multer({
    //saves file on file system in a folder named avatar.
    // dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
              if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
              return cb(new Error('Please upload an image only'))}
              return cb(undefined,true)
    }
})

router.patch('/users/me',auth,async (req,res)=>{
    const validUpdates=['name','age','email','password']
    const updates=Object.keys(req.body)
    const isValidUpdate=updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdate)
    return res.status(400).send('Invalid fields applied.')
    try{
        const user=req.user
        updates.forEach((update)=> user[update]=req.body[update])
        await user.save()
        res.send(user)}
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/users',auth,async (req,res)=>{
    try{
    const users=await User.find({})
    res.send(req.user)}
    catch(e){res.status(500).send()
    console.log(e)}
})
router.get('/users/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try{
    const user=await User.findById(_id)
        if(!user){
            return res.status(400).send('Invalid id provided.')
        }
        res.send(user)}
    catch(e){res.status(500).send()
    console.log(e)}
})


router.delete('/users/me',auth,async(req,res)=>{
    try{
    // const user=await User.findByIdAndRemove(req.params.id)
    // if(!user)
    // req.status(401).send('User not found')
    await req.user.remove()
    sendCancellationEmail(req.user.email,req.user.name)
    res.send(req.user)}catch(e){
        res.status(500).send()
        console.log(e)
    }
})
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
        console.log(e)
    } 
    //using Promise
    // user.save().then(()=>{
    //     res.status(200).send('Data Stored!')
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredential(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }
    catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })
        await req.user.save(
            res.send()
        )
    }catch(e){
            res.status(500).send(e)
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
         req.user.tokens=[]
         await req.user.save()
         res.send()
    }catch(e){res.status(500).send()}
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    // req.user.avatar=req.file.buffer
    const buffer= await sharp(req.file.buffer).resize({width:300,height:300}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
module.exports=router

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            res.status(400).send('User avatar does not exist')
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
})


// router.patch('/users/:id',auth,async (req,res)=>{
//     const validUpdates=['name','age','email','password']
//     const updates=Object.keys(req.body)
//     const isValidUpdate=updates.every((update)=>validUpdates.includes(update))
//     if(!isValidUpdate)
//     return res.status(400).send('Invalid fields applied.')
//     try{
//         const user=await findById(req.params.id)
//         updates.forEach((update)=> user[update]=req.body[update])
//         await user.save()
//         // this command runs directly and does not use mongoose
//         // we wont be able to run pre function on schema to hash the password if it is modified
//     // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//     if(!user){
//         return res.status(404).send({error:'Invalid id provided.'})
//     }
//     res.send(user)}
//     catch(e){
//         res.status(400).send(e)
//     }
// })

// router.delete('/users/:id',auth,async(req,res)=>{
//     try{
//     const user=await User.findByIdAndRemove(req.params.id)
//     if(!user)
//     req.status(401).send('User not found')
//     res.send(user)}catch(e){
//         res.status(500).send()
//         console.log(e)
//     }
// })