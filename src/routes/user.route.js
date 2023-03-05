const user = require('../controllers/user.controller');
const middleware = require('../middleware/auth');

const routes = async (fastify, options) => {
  fastify.post('/api/user/register', user.register);
  fastify.post('/api/user/login', user.login);
  fastify.route({
    method: 'GET',
    url: '/api/user/my_profile',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: user.myProfile
  })
}

module.exports = routes;