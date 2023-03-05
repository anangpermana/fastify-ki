const {QuestionItem, Option} = require('../db/models')
const response = require('../utils/response')

const createQuestionItem = async (request, reply) => {
  const {id, questionId, questionText, options} = request.body
  const cekSoal = await QuestionItem.findOne({
    where:{
      id: id
    }
  })
  if(cekSoal == null) {

    try {
      const result = await QuestionItem.create({
        questionId: questionId,
        questionText: questionText
      })
      options.forEach((item) => {
        Option.create({
          questionItemId: result.id,
          optionText: item.optionText,
          isCorrect: item.isCorrect
        })
      })
      response.ok(result, 'Berhasil', reply)
    } catch (error) {
      response.bad(error.message, reply)
    }
  } else {
    
    try {
      await Option.destroy({
        where: {
          questionItemId: id
        }
      })
      const result = await QuestionItem.update({
        questionId: questionId,
        questionText: questionText
      }, {
        where: {
          id: id
        }
      })
      options.forEach((item) => {
        Option.create({
          questionItemId: id,
          optionText: item.optionText,
          isCorrect: item.isCorrect
        })
      })
      response.ok(result, 'Berhasil', reply)
    } catch (error) {
      response.bad(error.message, reply)
    }

  }
}

const getQuestionItem = async (request, reply) => {
  const {questionId} = request.query

  try {
    const item = await QuestionItem.findAll({
      include: {
        model: Option,
        as:'options'
      },
      where: {
        questionId: questionId
      },
      order: [
        ['id', 'DESC']
      ]
    })
    response.ok(item, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const getQuestionById = async (request, reply) => {
  console.log(request.params.id)
  try {
    const question_item = await QuestionItem.findOne({
      include: {
        model: Option,
        as:'options'
      },
      where: {
        id: request.params.id
      }
    })
    if(question_item == null) {
      return response.notFound('Soal Not Found', reply)
    }
    response.ok(question_item, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
module.exports = {
  createQuestionItem,
  getQuestionItem,
  getQuestionById
}