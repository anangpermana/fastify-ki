const {Question, Category, QuestionItem} = require('../db/models')
const questionitem = require('../db/models/questionitem')
const response = require('../utils/response')

const createQuestion = async (request, reply) => {
  try {
    const {name, description, categoryId, questionId, typeId, isActive} = request.body
    const question = await Question.create({
      name: name,
      description: description,
      categoryId: categoryId,
      questionId: questionId,
      typeId: typeId,
      isActive: isActive
    })
    response.ok(question, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const getQuestion = async (request, reply) => {
  const {id, category_id} = request.query
  console.log(id)
  console.log(category_id)
  if(id) {
    try {
      const question = await Question.findOne({
        where:{
          id: id
        },
        include: {
          model: Category,
            as:'category'
        }
          
      })
      response.ok(question, 'Berhasil', reply)
    } catch (error) {
      response.bad(error.message, reply)
    }
  } else if (category_id) {
    try {
      const question = await Question.findAll({
        where:{
          categoryId: category_id
        },
        include: {
          model: QuestionItem,
            as:'item'
        }
          
      })
      response.ok(question, 'Berhasil', reply)
    } catch (error) {
      response.bad(error.message, reply)
    }
  }else{
    try {
      const question = await Question.findAll({
        include: [
          {
            model: Category,
              as:'category'
          },{
            model: QuestionItem,
            as: 'item'
          }
        ]
          
      })
      response.ok(question, 'Berhasil', reply)
    } catch (error) {
      response.bad(error.message, reply)
    }
  }
}

const getQuestionWithItem = async (request, reply) => {
  const {id} = request.query
  console.log(id)
  try {
    const question = await Question.findOne({
      where:{
        id: id
      },
      include: [
        {
          model: QuestionItem,
          as:'item'
        },
        {
          model: Category,
          as:'category'
        },
      ]
        
    })
    response.ok(question, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
module.exports = {
  createQuestion,
  getQuestion
}