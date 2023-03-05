'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quiz.belongsTo(models.Type, 
        {
          foreignKey: 'typeId', 
          as:'type'
        })
      Quiz.belongsTo(models.Category, {foreignKey: 'categoryId', as:'category'})
      Quiz.hasOne(models.PlayerQuiz, {foreignKey: {name:'quizId'}, as:'score'})
      Quiz.hasMany(models.PlayerQuiz, {foreignKey: {name:'quizId'}, as:'hasil'})
    }
  }
  Quiz.init({
    name: DataTypes.STRING,
    questionId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    isActive: DataTypes.INTEGER,
    totalSoal: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};