const middleware = require('../middleware/auth');
const question = require('../controllers/question.controller')

const route = async (fastify, options) => {
  fastify.route({
    method: 'POST',
    url: '/api/questions',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: question.createQuestion
  })

  fastify.route({
    method: 'GET',
    url: '/api/questions',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: question.getQuestion
  })
}

module.exports = route