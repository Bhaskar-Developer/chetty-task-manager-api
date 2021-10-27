const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

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
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

//Adding tasks as a Virtual Field for User. 
//This tasks field will store list of all tasks associated with a user
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

//Send only public information back after user logs in
userSchema.methods.toJSON = function() {
  const user = this //this here is the current instance of the user
  const userObject = user.toObject()
  
  //delete the password, tokens array and avatar as we don't want to send them
  delete userObject.tokens
  delete userObject.password
  delete userObject.avatar

  return userObject
}

//Generate Auth Token for user when logging in
userSchema.methods.generateAuthToken = async function() {
  const user = this //this here refers to the current user
  const token = jwt.sign({ _id: user._id.toString() } , process.env.JWT_SECRET)
  //append the generated token to the tokens array of the user and save it to DB
  user.tokens = user.tokens.concat({ token })
  await user.save()
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

//2. Delete all tasks associated with a user if this user is deleted
userSchema.pre('remove', async function(next) {
  const user = this //this refers to the current instance of user
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User