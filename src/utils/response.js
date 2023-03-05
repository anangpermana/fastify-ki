const ok = async (data, message, reply) => {
  let response = {
    status: true,
    message: message,
    data: data
  };
  if(!data) {
    response = {
      status: true,
      message: message
    }
  }
  return reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response)
}

const bad = async (message, reply) => {
  return reply
    .code(500)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      status: false,
      message:message
    })
}

const notFound = async (message, reply) => {
  return reply
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      status: false,
      message:message
    })
}

module.exports = {
  ok,
  bad,
  notFound
}