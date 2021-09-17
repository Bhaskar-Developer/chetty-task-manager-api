const mongoose = require('mongoose')
const validator = require('validator')

//User Model
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
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
  }
})

module.exports = User