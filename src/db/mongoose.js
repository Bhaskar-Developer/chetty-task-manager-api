const mongoose = require('mongoose')

//Connect to Database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true
})