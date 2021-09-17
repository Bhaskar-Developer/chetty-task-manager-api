const express = require('express')
require('./db/mongoose.js') //Connect to the database
const User = require('./models/user.js')
const app = express()

//This convert all incoming JSON to Javascript Object
app.use(express.json())

const PORT = process.env.PORT || 3000

//Add a user
app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save()
    .then(() => {
      res.send(user)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})