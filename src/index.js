const express = require('express')
require('./db/mongoose.js') //Connect to the database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter) 

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const bcrypt = require('bcryptjs')

const myFunction = async() => {
  const password = 'Red@12345'
  const hashedPassword = await bcrypt.hash(password, 8)

  console.log(password)
  console.log(hashedPassword)

  const isSame = await bcrypt.compare('Red@12345',hashedPassword)

  console.log(isSame)
}

myFunction()