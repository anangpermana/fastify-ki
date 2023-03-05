const middleware = require('../middleware/auth');
const quiz = require('../controllers/quiz.controller')

const routes = async (fastify, options) => {
  
  fastify.route({
    method: 'GET',
    url: '/api/quiz',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getAll
  })


  fastify.route({
    method: 'POST',
    url: '/api/quiz',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.createQuiz
  })
  
  fastify.route({
    method: 'POST',
    url: '/api/quiz/answer',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.answer
  })

  fastify.route({
    method: 'POST',
    url: '/api/quiz/saveplayerquiz',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.savePlayerQuiz
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/populer',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.populer
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/peringkat',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.peringkat
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/peringkatall',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.peringkatAll
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/review',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.review
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/getscore',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getScore
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/history',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getHistory
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/repeat',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.setRepeatQuiz
  })
  
  fastify.route({
    method: 'GET',
    url: '/api/quiz/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getQuiz
  })

  fastify.route({
    method: 'PUT',
    url: '/api/quiz/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.updateQuiz
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/active',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getActive
  })
  
  fastify.route({
    method: 'GET',
    url: '/api/quiz/quizitems/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getQuizItems
  })

  fastify.route({
    method: 'GET',
    url: '/api/quiz/category/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: quiz.getByCategory
  })

  
}

module.exports = routes