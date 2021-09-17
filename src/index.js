const express = require('express')
require('./db/mongoose.js') //Connect to the database
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()

//This convert all incoming JSON to Javascript Object
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})