const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationMail } = require('../emails/accounts')
const router = new express.Router()

//Add a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    //Send Welcome email to user's email id
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({
      user,
      token
    })
  } catch(e) {
    res.status(400).send(e)
  }
})

//Login User
router.post('/users/login',async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    })
  } catch(e) {
      res.status(400).send()
  }
})

//Logout User
router.post('/users/logout', auth, async (req, res) => {
  try {
    //get the tokens array from the logged in user
    //then remove the current token from the user and save it the user back to the database
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
   
    //save the user after removing the token 
    await req.user.save()

    res.send()
  } catch(e) {
      res.status(500).send()
  }
})

//Logout user from all Devices
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    //Remove all saved tokens from the logged in user
    req.user.tokens = []

    //save the user back to the database after the tokens are removed
    await req.user.save()

    res.send()
  } catch(e) {
    res.status(500).send()
  }
})

//Fetch current user profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

//Fetch a single user by id
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Update a user
router.patch('/users/me', auth, async (req, res) => {
  //Make sure that the user is allowed to only update valid fields

  //Create an array in which the keys are the entries
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name','email','password','age']
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update))
  if(!isValidUpdate) {
    return res.status(400).send({
      error:'Invalid Updates!'
    })
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send()
  } catch(e) {
    res.status(400).send(e)
  }  
})

//Delete a user
router.delete('/users/me', auth, async (req, res) => {
  try {
    //Delete the user from Database
    await req.user.remove()
    //send email to user
    sendCancellationMail(req.user.email, req.user.name)
    //Send back the deleted user as response
    res.send(req.user)
  } catch(e) {
    res.status(500).send(e)
  }
})

//Upload Avatar
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    //allow only images to be uploaded that have .jpg, .jpeg and .png extensions and size is less than 1 MB.
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Please upload an image.'))
    }
    //no error occured while uploading the avatar
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  //Compress profile picture to size 250x250 and convert it to .png
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
  req.user.avatar = buffer
  //save the profile image buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  //This function will catch the error thrown by multer if the uploaded images does not meet the set specifications.
  res.status(400).send({
    error: error.message
  })
})

//Delete user Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

//get user avatar from database
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type','image/jpg')
    res.send(user.avatar)
  } catch(e) {
    res.status(404).send()
  }
})

module.exports = router