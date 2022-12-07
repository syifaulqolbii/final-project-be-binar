'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Home extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Home.init({
    user_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER,
    origin_airport: DataTypes.STRING,
    destination_airport: DataTypes.STRING,
    depature_date: DataTypes.DATE,
    arrival_date: DataTypes.DATE,
    return_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Home',
  });
  return Home;
};