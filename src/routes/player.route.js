const player = require('../controllers/player.controller');
const middleware = require('../middleware/auth');

const routes = async (fastify, options) => {
  fastify.post('/api/player/register', player.register);
  fastify.post('/api/player/login', player.login);
  fastify.post('/api/player/verification', player.verification);
  fastify.post('/api/player/forgotpassword', player.forgotPassword);
  fastify.post('/api/player/confirmforgotpassword', player.confirmForgotPassword);
  fastify.post('/api/player/changepassword', player.changePassword);
  
  fastify.route({
    method: 'GET',
    url: '/api/players',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: player.getAll
  })

  fastify.route({
    method: 'GET',
    url: '/api/players/me',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: player.me
  })

  fastify.route({
    method: 'GET',
    url: '/api/players/score',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: player.getScore
  })
}

module.exports = routes;