'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      QuestionItem.hasMany(models.Option, {foreignKey:'questionItemId', as:'options'})
    }
  }
  QuestionItem.init({
    questionId: DataTypes.INTEGER,
    questionText: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'QuestionItem',
  });
  return QuestionItem;
};