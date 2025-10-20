import jwt from 'jsonwebtoken'
import User from '../models/user.js' 

const auth = async (req, res, next) => {
  try {
    //Get the Token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '')
    //validate the Token that was received from the Authorization header
    //If the token is valid then this will return back the payload i.e. _id
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //We search for the user who has the id as _id and token present in the tokens array
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) 
    
    if(!user) {
      throw new Error()
    }
    
    req.token = token
    req.user = user

    next()
  } catch(e) {
    res.status(401).send({
      error: 'Please Authenticate!'
    })
  }
}

export default auth