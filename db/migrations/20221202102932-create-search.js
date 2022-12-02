'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Searches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      home_id: {
        type: Sequelize.INTEGER
      },
      airlines_id: {
        type: Sequelize.INTEGER
      },
      depatur_time: {
        type: Sequelize.TIME
      },
      arrival_time: {
        type: Sequelize.TIME
      },
      duration_time: {
        type: Sequelize.STRING
      },
      price: {
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
    await queryInterface.dropTable('Searches');
  }
};