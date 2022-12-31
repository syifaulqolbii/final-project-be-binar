'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Transaction, {as: 'transaction'})
    }
  }
  Flight.init({
    origin_airport: DataTypes.STRING,
    destination_airport: DataTypes.STRING,
    depature_date: DataTypes.STRING,
    return_date: DataTypes.STRING,
    total_passenger: DataTypes.INTEGER,
    airlines: DataTypes.STRING,
    depature_time: DataTypes.STRING,
    arrival_time: DataTypes.STRING,
    duration_time: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};