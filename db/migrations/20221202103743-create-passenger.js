'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Passengers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_passenger: {
        type: Sequelize.STRING
      },
      identity_number: {
        type: Sequelize.STRING
      },
      identity_exp_date: {
        type: Sequelize.DATE
      },
      nationality: {
        type: Sequelize.STRING
      },
      identity_type: {
        type: Sequelize.ENUM('Passport', 'KTP')
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
    await queryInterface.dropTable('Passengers');
  }
};