const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//Add a new Task
router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
    await task.save()
    res.status(201).send(task)
  } catch(e) { 
    res.status(400).send(e)
  }
})

//Fetch all tasks

// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
  try {
    //Alternate Way to find tasks associated with a user
    //const tasks = await Task.find({ owner: req.user._id })
  
    const match = {}

    //check if the request query has a paramater as completed
    //If there is a no completed query then this will be a simple request to get all tasks associated with this user
    if(req.query.completed) {
      match.completed = req.query.completed === 'true'
      //This will return boolean true if req.query.completed matches the string true
      //This will return boolean false if req.query.completed does not match the string true
    }
    
    //Populate tasks associated with the user based on completed query
    await req.user.populate({
      path: 'tasks',
      match
    })
    res.send(req.user.tasks)
    
  } catch(e) {
    res.status(500).send(e)
  }
}) 

//Fetch a single task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    //Fetch the task if it belongs to this owner
    const task = await Task.findOne({ _id, owner: req.user._id })
    //Task will not be found if it does not belong to this owner
    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Update a Task
router.patch('/tasks/:id', auth, async (req, res) => {
  //Make sure that the user can only update valid fields
  const allowedUpdates = ['description','completed']
  const updates = Object.keys(req.body)
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update))
  if(!isValidUpdate) {
    return res.status(400).send({
      error:'Invalid Updates!'
    })
  }
  try {
    //Find the task by the id and make sure this task belongs to this user
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })   
    
    //Send a 404 response if the task is not found
    if(!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

//Delete a Task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    //Delete the task only if it belongs to this user
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })

    if(!task) {
      return res.status(404).send()
    }

    res.send(task)
    
  } catch(e) {
    res.status(500).send(e)
  }
})

module.exports = router