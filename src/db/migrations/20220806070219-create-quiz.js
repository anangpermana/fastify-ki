'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Quizzes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      questionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Questions'
        },
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories'
        },
        allowNull: false
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Types'
        },
        allowNull: false
      },
      isActive: {
        type: Sequelize.INTEGER
      },
      totalSoal: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Quizzes');
  }
};