const middleware = require('../middleware/auth');
const questionitem = require('../controllers/questionitem.controller')

const route = async (fastify, options) => {
  fastify.route({
    method:'POST',
    url: '/api/question_item',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: questionitem.createQuestionItem
  })

  fastify.route({
    method:'GET',
    url: '/api/question_item',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: questionitem.getQuestionItem
  })

  fastify.route({
    method:'GET',
    url: '/api/question_by_id/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: questionitem.getQuestionById
  })
  
}

module.exports = route