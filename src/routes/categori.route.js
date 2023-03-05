const middleware = require('../middleware/auth');
const category = require('../controllers/categori.controller')

const routes = async (fastify, options) => {
  fastify.route({
    method: 'GET',
    url: '/api/categories',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: category.getAll
  })

  fastify.route({
    method: 'POST',
    url: '/api/categories',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: category.addCategory
  })
  fastify.route({
    method: 'GET',
    url: '/api/categories/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: category.getCategory
  })
  fastify.route({
    method: 'PUT',
    url: '/api/categories/:id',
        preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: category.updateCategory
  })
  fastify.route({
    method: 'DELETE',
    url: '/api/categories/:id',
    preHandler: async (request, reply) => {
      await middleware.validateRequest(request, reply)
    },
    handler: category.destroyCategory
  })

}

module.exports = routes