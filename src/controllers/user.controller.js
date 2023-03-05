const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const response = require('../utils/response');
const jwt = require('../utils/jwt')

const register = async (request, reply) => {

  const {name, email, password} = request.body;
  const hash = bcrypt.hashSync(password, 10)
  if(!email || !password) {
    return response.bad('Email dan Password is required', reply)
  }
  try {
    let user = await User.findOne({
      where: {email:email}
    })

    if(user) {
      return response.bad('Email already exist', reply)
    }else{
      await User.create({
        name: name,
        email: email,
        password: hash
      })
      let userReg = await User.findOne({where: {email:email}});
      let data = {
        id: userReg.id,
        nam: name,
        email: email
      }
      return response.ok(data, 'Registrasi Berhasil', reply)
    }
  } catch (error) {
    
  }
}

const login = async (request, reply) => {
  let {email, password} = request.body;
  if(!email || !password) {
    return response.bad('Email dan Password is required', reply)
  }
  try {
    let user = await User.findOne({
      where: {email:email}
    })
    if(!user) {
      return response.bad('Email Not Found', reply)
    }

    let validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) {
      return response.bad('Password Invalid', reply)
    }

    let token = await jwt.createAccessToken({id: user.id, email:user.email});

    let data = {
      user: {id: user.id, email:user.email, name:user.name},
      accessToken: token
    }

    return response.ok(data, 'Berhasil', reply)

  } catch (error) {
    return response.bad(error.message, reply)
  }
}
const myProfile = async (request, reply) => {
  try {
    let user = await User.findOne({
      where: {id:request.user.id},
      attributes: ['id', 'name', 'email']
    })
    return response.ok(user, 'Berhasil', reply)
  } catch (error) {
    return response.bad(error.message, reply)
  }
}
module.exports = {
  register,
  login,
  myProfile
}