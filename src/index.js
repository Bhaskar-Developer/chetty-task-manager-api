const express = require('express')
require('./db/mongoose.js') //Connect to the database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

//Maintainance Middleware Function
// app.use((req, res, next) => {
//   res.status(503).send('The Website is under maintainance. Please come back later!')
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter) 

const PORT = process.env.PORT || 3000

const multer = require('multer')

const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload Word Document.'))
    }
    //no error
    cb(undefined, true)
  }
})


app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
}, (error, req, res, next) => { //Catch the error and send it back as JSON response
  res.status(400).send({
    error: error.message
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async() => {
//   const token = jwt.sign({ _id: 'test@123' }, 'thisismycourse', { expiresIn: '7 days' })
//   console.log(token)

//   const data = jwt.verify(token, 'thisismycourse')
//   console.log(data)
// }
//myFunction()

//const Task = require('./models/task')
//const User = require('./models/user')

// const main = async () => {
//   // //Relationship of a task with a user
//   // //Fetch task based on the _id 
//   // const task = await Task.findById('615493949447b6bc811899c4')
//   // //populate the owner field with the entire user who created this task
//   // await task.populate('owner')
//   // console.log(task.owner)

//   //Relationship of user with all the tasks that was created by this user
//   //Fetch user based on the specified _id
//   const user = await User.findById('6154934d9447b6bc811899be')
//   //populate the tasks associated with this user
//   await user.populate('tasks')
//   console.log(user.tasks)
// }

//main()