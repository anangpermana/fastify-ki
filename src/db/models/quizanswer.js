'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // QuizAnswer.belongsTo(models.Option,
      //   {
      //     foreignKey: 'questionItemId',
      //     as:'option'
      //   })
      QuizAnswer.belongsTo(models.Option,
        {
          foreignKey: 'optionId',
          as:'option'
        })
      QuizAnswer.belongsTo(models.QuestionItem,
        {
          foreignKey: 'questionItemId',
          as:'question'
        })
    }
  }
  QuizAnswer.init({
    playerId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    questionItemId: DataTypes.INTEGER,
    optionId: DataTypes.INTEGER,
    answer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuizAnswer',
  });
  return QuizAnswer;
};