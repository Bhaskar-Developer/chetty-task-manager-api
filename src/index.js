const app = require('./app')
const path = require('path')
const express = require('express')

//Set up Static folder
app.use(express.static(path.join(__dirname, '../public')))

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})