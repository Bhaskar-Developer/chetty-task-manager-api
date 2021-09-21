const express = require('express')
require('./db/mongoose.js') //Connect to the database
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()

//This converts all incoming JSON to Javascript Object
app.use(express.json())

const PORT = process.env.PORT || 3000

//Add a new user
app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch(e) {
    res.status(400).send(e)
  }
})

//Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Fetch a single user by id
app.get('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Update a user
app.patch('/users/:id', async (req, res) => {
  //Make sure that the user is allowed to only update valid fields
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name','email','password','age']
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update))
  if(!isValidUpdate) {
    return res.status(400).send({
      error:'Invalid Updates!'
    })
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //This makes sure to return the new user after the update operation
      runValidators: true
    })
    if(!updatedUser) {
      return res.status(404).send()
    }
    res.send(updatedUser)
  } catch(e) {
    res.status(400).send(e)
  }  
})

//Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if(!deletedUser) {
      return res.status(404).send()
    }
    res.send(deletedUser)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Add a new Task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch(e) { 
    res.status(400).send(e)
  }
})

//Fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch(e) {
    res.status(500).send(e)
  }
}) 

//Fetch a single task
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findById(_id)
    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Update a Task
app.patch('/tasks/:id', async (req, res) => {
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
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if(!updatedTask) {
      return res.status(404).send()
    }
    res.send(updatedTask)
  } catch (e) {
    res.status(400).send(e)
  }
})

//Delete a Task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    if(!deletedTask) {
      return res.status(404).send()
    }
    res.send(deletedTask)
  } catch(e) {
    res.status(500).send(e)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})