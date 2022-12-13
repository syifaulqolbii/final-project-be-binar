'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Users", "status", {
        type: Sequelize.STRING,
        enum: ['Pending', 'Active'],
        default: 'Pending',
      }),
      queryInterface.addColumn("Users", "confirmationCode", {
        type: Sequelize.STRING,
        unique: true,
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn("Users", "status")]);
  }
};
