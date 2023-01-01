'use strict';
var bcrypt = require('bcrypt');
var { MODUL } = require('../../utils/enum');
var { Modul, User, RoleAcces } = require('../models');
var dummyAdmin = {
  name: 'admin',
  email: 'admin@mail.com',
  passowrd: 'admin',
  isVerified: true
};
var dummyUser = {
  name: 'user',
  email: 'user@mail.com',
  passowrd: '123',
  isVerified: true
};

module.exports = {
  async up (queryInterface, Sequelize) {
    for (var property in MODUL) {
      var modul = await Modul.findOne({ where: { name: property } });
      if (!modul) {
        await Modul.create({ name: property });
      }
    }

    var admin = await User.findOne({ where: { email: dummyAdmin.email } });
    if (!admin) {
      var password = await bcrypt.hash(dummyAdmin.passowrd, 10);
      admin = await User.create({
        name: dummyAdmin.name,
        email: dummyAdmin.email,
        password: password,
        role: 'Admin',
        user_type: "basic"
      });
    }

    var user = await User.findOne({ where: { email: dummyUser.email } });
    if (!user) {
      var password = await bcrypt.hash(dummyUser.passowrd, 10);
      user = await User.create({
        name: dummyUser.name,
        email: dummyUser.email,
        password: password,
        isVerified: dummyUser.isVerified,
        role: 'Buyer'
      });
    }
    
    for (var property in MODUL) {
      var modul = await Modul.findOne({ where: { name: property } });
      var roleAdmin = await User.findOne({ where: { role : 'Admin'  } });
      var roleUser = await User.findOne({ where: { role : 'Buyer' } });

      // admin Acces Admin & User Dahboard
      var ra = await RoleAcces.findOne({ where: { user_id: roleAdmin.id, module_id: modul.id } });
      if (!ra) {
        await RoleAcces.create({
          user_id: roleAdmin.id,
          module_id: modul.id,
          read: true,
          write: true,
        });
      }

      // user Acces userDashboard
      var ura = await RoleAcces.findOne({ where: { user_id: roleUser.id, module_id: modul.id } });
      if (!ura) {
        await RoleAcces.create({
          user_id: roleUser.id,
          module_id: 1,
          read: true,
          write: true,
        });
      }

      //user accces AdminDashboard
      var ura1 = await RoleAcces.findOne({ where: { user_id: roleUser.id, module_id: modul.id } });
      if (!ura1) {
        await RoleAcces.create({
          user_id: roleUser.id,
          module_id: 2,
          read: false,
          write: false,
        });
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
