'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Category, {foreignKey:'categoryId', as:'category'})
      Question.hasMany(models.QuestionItem, {foreignKey:'questionId', as:'item'})
    }
  }
  Question.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};