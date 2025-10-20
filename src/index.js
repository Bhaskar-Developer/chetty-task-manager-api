import express from 'express'
import path from 'path'
import app from './app.js'

//Set up Static folder
app.use(express.static(path.join(path.resolve(), '/public')))

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})