const express = require('express')
require('./db/mongoose.js') //Connect to the database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

//Express Middleware
// app.use((req, res, next) => {
//   if(req.method === 'GET') {
//     return res.send('GET requests are disabled!')
//   }
//   next()
// })


//Maintainance Middleware Function
// app.use((req, res, next) => {
//   res.status(503).send('The Website is under maintainance. Please come back later!')
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter) 

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const jwt = require('jsonwebtoken')

const myFunction = async() => {
  const token = jwt.sign({ _id: 'test@123' }, 'thisismycourse', { expiresIn: '7 days' })
  console.log(token)

  const data = jwt.verify(token, 'thisismycourse')
  console.log(data)
}

//myFunction()