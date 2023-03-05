const jwt = require('../utils/jwt')
const response = require('../utils/response')

const validateRequest = async (request, replay) => {
  try {
    let auth = request.headers['authorization'] 
    let token = auth?.replace('Bearer ', '')
    
    let user = await jwt.verifyToken(token)
    request.user = user

  } catch (error) {
    return response.bad('Unauthorization', replay)
  }
}

module.exports = {
  validateRequest
}