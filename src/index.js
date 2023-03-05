require('dotenv').config();

const fastify = require('fastify')({
  logger: true,
})
const path = require('path')

fastify.get('/', function(request, reply) {
  reply.send({message: 'Rest API Kuis Islami'})
})
//static
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'images'),
  prefix: '/public/',
})
//multer
const multer = require('fastify-multer')
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './src/images/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname)
  }
})
const upload = multer({storage:storage})
fastify.register(multer.contentParser)
fastify.route({
  method: 'POST',
  url: '/api/categories/upload_image',
  preHandler: upload.single('file'),
  handler: function(request, reply) {
    console.log(request.file.filename)
    reply.code(200).send({message:'berhasil upload', data:request.file.filename})
  }
})
//cors
const cors = require('@fastify/cors')
fastify.register(cors, {Credential:true, origin: process.env.CORS_HOST})

//route
fastify.register(require('./routes/categori.route'));
fastify.register(require('./routes/user.route'));
fastify.register(require('./routes/question.route'));
fastify.register(require('./routes/player.route'));
fastify.register(require('./routes/quiz.route'));
fastify.register(require('./routes/questionitem.route'));
console.log(process.env.PORT)

const start = async () => {
  try {
    await fastify.ready()
    await fastify.listen({ port: process.env.PORT, host:'0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()