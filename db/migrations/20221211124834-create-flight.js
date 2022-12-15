'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      origin_airport: {
        type: Sequelize.JSON
      },
      destination_airport: {
        type: Sequelize.JSON
      },
      depature_date: {
        type: Sequelize.STRING
      },
      return_date: {
        type: Sequelize.STRING
      },
      total_passenger: {
        type: Sequelize.INTEGER
      },
      airlines: {
        type: Sequelize.STRING
      },
      depature_time: {
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
    await queryInterface.dropTable('Flights');
  }
};