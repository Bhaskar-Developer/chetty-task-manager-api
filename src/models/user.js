const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Entered email is invalid.')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      //make sure length of password is more than 6
      if(value.length <= 6) {
        throw new Error('Passowrd should be atleast 7 characters long.')
      }
      //make sure the word "password"/"Passowrd" is not present in password
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain the word "password".')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      //make sure that age is not negative
      if(value < 0) {
        throw new Error('Age cannot be negative')
      }
    }
  },
  tokens:[{
    token: {
      type: String,
      required: true 
    }
  }]
})

//Generate Auth Token for user when logging in
userSchema.methods.generateAuthToken = async function() {
  const user = this //this here refers to the current user
  const token = jwt.sign({ _id: user._id.toString() } , 'thisismycourse')
  return token
}

//Login the user if he/she is already present in database
userSchema.statics.findByCredentials = async (email, password) => {
  //search for user who has the email. If user does not exist with the email then throw error
  const user = await User.findOne({ email })
  if(!user) {
    throw new Error('Unable to Login')
  }
  //Login the user if the entered password is same as the one stored in database. If password does not match then throw error 
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    throw new Error('Unable to Login')
  }

  return user
}

//Run Moongoose Middleware
//1. Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this //here this is the current user that is going to be saved in DB
  if(user.isModified('password')) { //This will run when the user is created or password is updated
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User