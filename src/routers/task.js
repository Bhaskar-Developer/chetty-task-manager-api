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
// GET /tasks?limit=10&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  try {
    const { completed, sortby, limit, skip } = req.query

    // GET /tasks?completed=true
    // Fetch only those tasks from DB that were competed
    if(completed === 'true') {      
      const tasks = await Task.find({
        owner: req.user._id,
        completed: true
      })

      return res.send(tasks)
    }

    // GET /tasks?completed=false
    // Fetch only those tasks from DB that were not completed 
    if(completed === 'false') {
      const tasks = await Task.find({
        owner: req.user._id,
        completed: false
      })

      return res.send(tasks)
    }
        
    //Limit and Skip  -- Yet to Implement
    if(limit > -1 && skip > -1) {
      const li = parseInt(limit)
      const sk = parseInt(skip)
      const tasks = await Task.find({ owner: req.user._id }).limit(li).skip(sk)
      return res.send(tasks)
    }

    //Populate all tasks associated with the user
    await req.user.populate('tasks')

    //Sort the tasks by the descending order of time they were created
    if(sortby === 'desc') {
      req.user.tasks.reverse()
      return res.send(req.user.tasks)
    }

    //This will send all the tasks if there is no parameter passed to req.params
    //This will also run if req.params.sortby=asc
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