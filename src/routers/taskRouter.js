const express=require('express')
const Task=require('../models/Task')
const router=new express.Router()
const auth=require('../middleware/auth')


router.post('/tasks',auth,async (req,res)=>{
    // const user=new Task(req.body)
    try{
        const user=new Task({
            ...req.body,
            owner:req.user._id
        })
        await user.save()
        res.status(201).send(user)
    }
   catch(error){
        res.status(400).send(error)
    }
})


router.get('/tasks',auth,async (req,res)=>{
    try{
        // const tasks=await Task.find({owner:req.user._id})
        const match={}
        const sort={}
        if(req.query.completed){
            match.completed=req.query.completed==='true'
        }
        if(req.query.sortBy){
            const parts=req.query.sortBy.split(':')
            sort[parts[0]]=parts[1]==='desc'?-1:1
        }
        // await req.user.populate('tasks').execPopulate()
        // applying queries to populated data
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // res.send(tasks)
        res.send(req.user.tasks)
        
    }catch(e){
        res.status(500).send()
    }
    
    // Task.find({}).then((tasks)=>res.send(tasks)).catch((e)=>res.status(500).send())
})
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try{
    const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(400).send('Invalid id provided.')
        }
        res.send(task)
    }catch(e){res.status(500).send()
    console.log(e)}
})


router.patch('/tasks/:id',auth,async (req,res)=>{
    const validUpdates=['desc','completed']
    const updates=Object.keys(req.body)
    const isValidUpdate=updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdate)
    return res.status(400).send('Invalid fields applied.')
    try{
    // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
    if(!task){
        return res.status(404).send({error:'Invalid id provided.'})
    }
    updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
    res.send(task)}
    catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
    const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if(!task)
    res.status(401).send('Task not found')
    res.send(task)}
    catch(e){
        res.status(500).send()
        console.log(e)

    }
})

module.exports=router