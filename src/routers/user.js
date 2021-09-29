const express = require('express')
const User = require('../models/user')
const router = new express.Router()

//Add a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
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

//Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch(e) {
    res.status(500).send(e)
  }
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
router.patch('/users/:id', async (req, res) => {
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
    const user = await User.findById(req.params.id)
    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(e) {
    res.status(400).send(e)
  }  
})

//Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if(!deletedUser) {
      return res.status(404).send()
    }
    res.send(deletedUser)
  } catch(e) {
    res.status(500).send(e)
  }
})

module.exports = router