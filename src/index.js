const express = require('express')
require('./db/mongoose.js') //Connect to the database
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()

//This converts all incoming JSON to Javascript Object
app.use(express.json())

const PORT = process.env.PORT || 3000

//Add a new user
app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save()
    .then(() => {
      res.status(201).send(user)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

//Add a new Task
app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save()
    .then(() => {
      res.status(201).send(task)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

//Fetch all users
app.get('/users', (req,res) => {
  User.find({})
    .then((users) => {
      res.send(users)  
    })
    .catch((e) => {
      res.status(500).send()
    })
})

//Fetch a single user by id
app.get('/users/:id', (req, res) => {
  const _id = req.params.id
  User.findById(_id)
    .then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    })
    .catch((e) => {
        res.status(500).send()
    })
})

//Fetch all tasks
app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks)
    })
    .catch((e) => {
      res.status(500).send()
    })
})

//Fetch a single task
app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  Task.findById(_id)
    .then((task) => {
      if(!task) {
        return res.status(404).send()
      }
      res.send(task)
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})