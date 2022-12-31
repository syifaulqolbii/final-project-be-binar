'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsToMany(models.Transaction, {through: 'Transactions', foreignKey: 'PassengerId', as: 'passenger'})
      this.hasMany(models.transactionMapping, {as: 'mapping'})
    }
  }
  Passenger.init({
    name_passenger: DataTypes.STRING,
    identity_number: DataTypes.STRING,
    identity_exp_date: DataTypes.STRING,
    nationality: DataTypes.STRING,
    identity_type: DataTypes.ENUM('Passport','KTP')
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};