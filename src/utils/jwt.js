require('dotenv').config();
const jwt = require('jsonwebtoken')

const createAccessToken = async (data) => {
  return new Promise((resolve, reject) => {
    jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: 31536000
    }, (err, token) => {
      if(err) reject(err)
      resolve(token)
    })
  })
}

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    if(!token){
      reject('Token Tidak Ada')
      return
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, decode) => {
      if(err) {
        reject('Invalid Token')
        return
      }
      resolve(decode)
    })
  })
}

module.exports = {
  createAccessToken,
  verifyToken
}