const {Category} = require('../db/models')
const response = require('../utils/response')
const fs = require("fs")

const getAll = async (request, reply) => {
  try {
    let categories = await Category.findAll()
    return response.ok(categories, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}

const addCategory = async (request, reply) => {
  try {
    await Category.create({
      name: request.body.name,
      image: request.body.image
    })
    return response.ok('', 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const getCategory = async (request, reply) => {
  try{
    const category = await Category.findOne({where:{id:request.params.id}})
    if(category == null) {
      return response.notFound('Category Not Found', reply);
    }
    response.ok(category, 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const updateCategory = async (request, reply) => {
  try {
    const category = await Category.update({
      name: request.body.name,
      image: request.body.image,
      status: request.body.status
    },{where: {id: request.params.id}})
    // console.log(category)
    response.ok('', 'Berhasil update category', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
const destroyCategory = async (request, reply) => {
  try {
    await Category.destroy({where:{id:request.params.id}})
    response.ok('', 'Berhasil', reply)
  } catch (error) {
    response.bad(error.message, reply)
  }
}
module.exports = {
  getAll,
  addCategory,
  destroyCategory,
  getCategory,
  updateCategory
}