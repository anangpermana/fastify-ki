const {sequelize, Quiz, Type, Category, QuestionItem, Option, QuizAnswer, PlayerQuiz, Player} = require('../db/models')
const response = require('../utils/response')
const moment = require ('moment')
const { Op } = require('sequelize')

const getAll = async (request, reply) => {
  // console.log(request.user.id)
  const {limit} = request.query;

  try {
    const quiz = await Quiz.findAll({
      limit: limit,
      where: {
        typeId: 1
      },
      order: [
        ['id', 'DESC']
      ],
      include: [{
        model: Type,
        as: 'type',
        attributes: ['id', 'name'],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image']
      },{
        model: PlayerQuiz,
        as: 'hasil'
      }
      ]
    });
    response.ok(quiz, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const getHistory = async (request, reply) => {
  // console.log(request.user.id)
  try {
    const quiz = await Quiz.findAll({
      where: {
        typeId: 1
      },
      include: [{
        model: Type,
        as: 'type',
        attributes: ['id', 'name'],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image']
      },
      {
        model: PlayerQuiz,
        as:'score',
        attributes: ['id','score', 'timeStart', 'timeEnd', 'updatedAt'],
        where: {
          playerId: request.user.id
        }
      }
      ]
    });
    response.ok(quiz, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const getActive = async (request, reply) => {

  try {
    const quiz = await Quiz.findAll({
      where: {
        isActive: 1

      },
      include: [{
        model: Type,
        as: 'type',
        attributes: ['id', 'name'],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image']
      }
      ]
    });
    response.ok(quiz, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const getQuiz = async (request, reply) => {
  try {
    const quiz = await Quiz.findOne({
      where: {
        id: request.params.id
      },
      include: [{
        model: Type,
        as: 'type',
        attributes: ['id', 'name']
      }, {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image']
      }]
    })
    if (quiz == null) {
      return response.notFound('Quiz Nof Found', reply)
    }
    response.ok(quiz, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const createQuiz = async (request, reply) => {
  const {name, description, questionId, categoryId, typeId, isActive, totalSoal} = request.body
  try {
    const quiz = await Quiz.create({
      name: name,
      description: description,
      questionId: questionId,
      categoryId: categoryId,
      typeId: typeId,
      isActive: isActive,
      totalSoal: totalSoal
    })
    response.ok(quiz, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const updateQuiz = async (request, reply) => {
  const {name, description, questionId, categoryId, typeId, isActive, totalSoal} = request.body

  try {
    const quiz = await Quiz.update({
      name: name,
      description: description,
      questionId: questionId,
      categoryId: categoryId,
      typeId: typeId,
      isActive: isActive,
      totalSoal: totalSoal
    },{where: {id: request.params.id}})
    response.ok(quiz, 'Berhasil update quiz', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const getQuizItems = async (request, reply) => {
  try {
    const questionItems = await QuestionItem.findAll({
      include: {
        model: Option,
        as: 'options',
        attributes: ['id', 'questionItemId', 'optionText']
      },
      where: {
        questionId: request.params.id
      },
      order: [
        ['id', 'ASC']
      ]
    })
    response.ok(questionItems, 'Berhasil', reply)

  } catch (error) {
    response.bad(error.message, reply)
  }
}

const answer = async (request, reply) => {
  const {playerId, questionId, optionId} = request.body
  
  try {
    const option = await Option.findOne({
      where: {
        id: optionId
      }
    })

    const cek = await QuizAnswer.findOne({
      where: {
        playerId: playerId,
        questionId: questionId,
        questionItemId: option.questionItemId
      }
    })

    if(cek){
      
      await QuizAnswer.update({
        playerId: playerId,
        questionId: questionId,
        questionItemId : option.questionItemId,
        optionId: option.id,
        answer: option.isCorrect
      },
      {
        where: {id: cek.id}
      }
      )
      response.ok(option.isCorrect, 'Berhasil', reply)
      
    }else{
      await QuizAnswer.create({
        playerId: playerId,
        questionId: questionId,
        questionItemId : option.questionItemId,
        optionId: option.id,
        answer: option.isCorrect
      })
      response.ok(option.isCorrect, 'Berhasil', reply)
    }
    
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const savePlayerQuiz = async (request, reply) => {
  const {quizId, score, timeStart, timeEnd} = request.body
  const {id} = request.user
  try {
    const cek = await PlayerQuiz.findOne({
      where: {
        quizId: quizId,
        playerId: id,
      }
    })
    
    if(cek) {
      await PlayerQuiz.update({
        score: score
      },
      {
        where: {
          id: cek.id
        }
      });
      const scoreend = await PlayerQuiz.findAll({
        attributes: [
          'playerId',
          [sequelize.fn('sum', sequelize.col('score')), 't_score']
        ],
        group: ['playerId'],
        where: {
          playerId: request.user.id
        }
      })
      response.ok(scoreend[0], 'Berhasil', reply)
    }else{
      await PlayerQuiz.create({
        quizId: quizId,
        playerId: id,
        score: score,
        timeStart: timeStart,
        timeEnd: timeEnd
      })
      const scoreend = await PlayerQuiz.findAll({
        attributes: [
          'playerId',
          [sequelize.fn('sum', sequelize.col('score')), 't_score']
        ],
        group: ['playerId'],
        where: {
          playerId: request.user.id
        }
      })
      response.ok(scoreend[0], 'Berhasil', reply)
    }
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const populer = async (request, reply) => {
  try {
    const populer = await PlayerQuiz.findAll({
      attributes: [
        'quizId',
        [sequelize.fn('count', sequelize.col('quizId')), 'populer']
      ],
      include: [{
        model: Quiz,
        as: 'quiz',
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'image']
          }
        ]
      }],
      group: ['quizId', 'quiz.id', 'quiz.category.id'],
      order: [
        [sequelize.literal('populer'), 'DESC']
      ]
    })
    response.ok(populer, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const peringkat = async (request, reply) => {
  try {
    const peringkat = await PlayerQuiz.findAll({
      attributes: [
        'playerId',
        [sequelize.fn('sum', sequelize.col('score')), 't_score']
      ],
      include: [{
        model: Player,
        as: 'player',
        attributes: ['id', 'fullName', 'email']
      }],
      group: ['playerId', 'player.id'],
      order: [[sequelize.literal('t_score'), 'DESC']]
    })
    const peringkatPlayer = peringkat.findIndex(x => x.playerId === request.user.id)
    const data = {
      peringkat: parseInt(peringkatPlayer) + 1
    }
    response.ok(data, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const peringkatAll = async (request, reply) => {
  const {all_time} = request.query

  try {
    if(all_time == "true") {
      const peringkat = await PlayerQuiz.findAll({
        where: {
          createdAt: {
            [Op.gte]: moment().subtract(7, 'days').toDate()
          }
        },
        attributes: [
          'playerId',
          [sequelize.fn('sum', sequelize.col('score')), 't_score']
        ],
        include: [{
          model: Player,
          as: 'player',
          attributes: ['id', 'fullName', 'email']
        }],
        group: ['playerId', 'player.id'],
        order: [[sequelize.literal('t_score'), 'DESC']]
      })
      response.ok(peringkat, 'Berhasil', reply)
    } else {
      const peringkat = await PlayerQuiz.findAll({
        
        attributes: [
          'playerId',
          [sequelize.fn('sum', sequelize.col('score')), 't_score']
        ],
        include: [{
          model: Player,
          as: 'player',
          attributes: ['id', 'fullName', 'email']
        }],
        group: ['playerId', 'player.id'],
        order: [[sequelize.literal('t_score'), 'DESC']]
      })
      response.ok(peringkat, 'Berhasil', reply)
    }
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const review = async (request, reply) => {
  const { id } = request.user
  const { questionId } = request.query
  try {
    const data = await QuizAnswer.findAll({
      include: [
        {
          model: QuestionItem,
          as: 'question',
          attributes: ['id', 'questionId', 'questionText'],
          include: [
            {
              model: Option,
              as: 'options',
              attributes: ['id', 'questionItemId', 'optionText', 'isCorrect']
            }
          ]
        },{
          model: Option,
          as: 'option'
        }
      ],
      where: {
        playerId : id,
        questionId: questionId
      }
    })
    response.ok(data, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const getScore = async (request, reply) => {
  const {quizId} = request.query
  try {
    const score = await PlayerQuiz.findOne({
      attributes: ['id', 'quizId', 'playerId', 'score'],
      where: {
        quizId: quizId,
        playerId: request.user.id
      }
    })
    
    if(score) {
      response.ok(score, 'Berhasil', reply)
    }else(
      response.notFound('Not Found', reply)
    )
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const getByCategory = async (request, reply) => {
  
  try {
    const kuis = await Quiz.findAll({
      where: {
        typeId: 1,
        categoryId: request.params.id
      },
      include: [{
        model: Type,
        as: 'type',
        attributes: ['id', 'name'],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image']
      },{
        model: PlayerQuiz,
        as: 'hasil'
      }
      ]
    });
    
    if(kuis.length > 0) {
      response.ok(kuis, 'Berhasil', reply)
    }else{
      response.notFound('Not Found', reply)
    }

  } catch (error) {
    response.bad(error.message, reply)
  }
}

const setRepeatQuiz = async (request, reply) => {
  const {quizId, questionId} = request.query

  try {
    await QuizAnswer.destroy({
      where: {
        playerId: request.user.id,
        questionId: questionId
      }
    })
    await PlayerQuiz.destroy({
      where: {
        playerId: request.user.id,
        quizId: quizId
      }
    })
    response.ok('', 'Berhasil', reply)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAll,
  createQuiz,
  getQuiz,
  getActive,
  updateQuiz,
  getQuizItems,
  answer,
  savePlayerQuiz,
  populer,
  peringkat,
  peringkatAll,
  review,
  getScore,
  getByCategory,
  getHistory,
  setRepeatQuiz
}
