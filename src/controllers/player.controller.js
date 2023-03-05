const bcrypt = require('bcrypt');
const { Player, PlayerQuiz, sequelize } = require('../db/models');
const response = require('../utils/response');
const jwt = require('../utils/jwt')
const kirimEmail = require('../utils/email')

const getRandomCode = (chars, len)=>[...Array(len)].map(
   (i)=>chars[Math.floor(Math.random()*chars.length)]
).join('');

const register = async (request, reply) => {
  
  const {fullName, handphone, email, password, fcmToken, os} = request.body;
  const hash = bcrypt.hashSync(password, 10)
  if(!email || !password) {
    return response.bad('Email dan Password is required', reply)
  }

  
  try {
    let user = await Player.findOne({
      where: {email:email}
    })

    if(user) {
      return response.bad('Email already exist', reply)
    }else{
      const code = getRandomCode('0123456789', 4);
      await kirimEmail(email, 'Verification Code KuisIslami', code).then(async(res) => {
        await Player.create({
          fullName: fullName,
          handphone: handphone,
          email: email,
          password: hash,
          fcmToken: fcmToken,
          os: os,
          isActive: 0,
          isVerified: 0,
          verificationCode: code
        })
      }).catch(err => {
        console.log(err)
        response.bad('Email not send', reply )
      })
      
      return response.ok('', 'Registrasi Berhasil', reply)
    }
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const verification = async (request, reply) => {
  let {code} = request.body;
  if(!code){
    return response.bad('Code is required', reply)
  }

  try{
    const user = await Player.findOne({
      where: {verificationCode:code}
    })
    if(user === null) {
      return response.bad('Code not found', reply)
    }
    await Player.update({
      isVerified:1,
      isActive: 1
    }, {where: {id: user.id}})
    const token = await jwt.createAccessToken({id: user.id, email: user.email});

    const data = {
      accessToken: token
    }
    response.ok(data, 'Berhasil', reply)
  }catch(error) {
    response.bad(error.message, reply)
  }
}

const login = async (request, reply) => {
  let {email, password} = request.body;
  if(!email || !password) {
    return response.bad('Email dan Password is required', reply)
  }
  try {
    let user = await Player.findOne({
      where: {email:email}
    })
    if(!user) {
      return response.bad('Email Not Found', reply)
    }

    let validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) {
      return response.bad('Password Invalid', reply)
    }

    if (!user.isVerified) {
      return response.bad('User not varification !, cek code in your email ' + user.email, reply)
    }
    if (!user.isActive) {
      return response.bad('User not active', reply)
    }


    let token = await jwt.createAccessToken({id: user.id, email:user.email});

    let data = {
      user: {id: user.id, email:user.email, name:user.fullName},
      accessToken: token
    }

    return response.ok(data, 'Berhasil', reply)

  } catch (error) {
    return response.bad(error.message, reply)
  }
}

const forgotPassword = async (request, reply) => {
  let {email} = request.body
  try {
    let user = await Player.findOne({
      where: {email:email}
    })
    if(!user) {
      return response.bad('Email no found !', reply)
    }else{
      const code = getRandomCode('0123456789', 4);
      await kirimEmail(user.email, 'Confirmation Code Reset Password', code).then(async() => {
      try {
        await Player.update({
          passwordCode: code
        }, {where: {id: user.id}})
        
      } catch (error) {
        response.bad(error.message, reply)
      }

      }).catch(err => {
        response.bad(err, reply)
      })

      return response.ok('', 'Forgot Password Berhasil', reply)

    }
  } catch (error) {
    return response.bad(error, reply)
  }
}

const confirmForgotPassword = async (request, reply) => {
  let {code} = request.body;
  if(!code){
    return response.bad('Code is required', reply)
  }

  try{
    const user = await Player.findOne({
      where: {passwordCode:code}
    })
    if(user === null) {
      return response.bad('Code not found', reply)
    }
    
    response.ok('', 'Berhasil', reply)
  }catch(error) {
    response.bad(error.message, reply)
  }
}

const changePassword = async (request, reply) => {
  let {email, password} = request.body
  const hash = bcrypt.hashSync(password, 10)
  try {
    let user = await Player.findOne({
      where: {email:email}
    })
    if(!user) {
      return response.bad('Email no found !', reply)
    }else{
      try {
        await Player.update({
          password: hash
        }, {where: {id: user.id}})
        
      } catch (error) {
        response.bad(error.message, reply)
      }

      return response.ok('', 'Change Password Berhasil', reply)

    }
  } catch (error) {
    return response.bad(error, reply)
  }
}

const getAll = async (request, reply) => {
  try{
    const data = await Player.findAll({
      attributes: ['id', 'fullName','email', 'handphone', 'isActive', 'isVerified']
    });
    response.ok(data, 'Berhasil', reply)
    
  } catch(error) {
    response.bad(error.message, reply)
  }
}

const me = async (request, reply) => {
  
  try {
    const user = await Player.findOne({
      attributes: ['id', 'fullName', 'email', 'isActive', 'isVerified'],
      where: {
        id: request.user.id
      }
    })
    
    response.ok(user, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const getScore = async (request, reply) => {
  try {
    const score = await PlayerQuiz.findAll({
      attributes: [
        'playerId',
        [sequelize.fn('sum', sequelize.col('score')), 't_score']
      ],
      group: ['playerId'],
      where: {
        playerId: request.user.id
      }
    })
    response.ok(score[0], 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
module.exports = {
  register,
  login,
  verification,
  getAll,
  forgotPassword,
  confirmForgotPassword,
  changePassword,
  me,
  getScore
}