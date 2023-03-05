'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayerQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayerQuiz.belongsTo(models.Quiz, {
        foreignKey: 'quizId',
        as: 'quiz'
      })

      PlayerQuiz.belongsTo(models.Player, {
        foreignKey: 'playerId',
        as: 'player'
      })
    }
  }
  PlayerQuiz.init({
    quizId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    score: DataTypes.FLOAT,
    timeStart: DataTypes.TIME,
    timeEnd: DataTypes.TIME,
  }, {
    sequelize,
    modelName: 'PlayerQuiz',
  });
  return PlayerQuiz;
};