'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Search extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Search.init({
    home_id: DataTypes.INTEGER,
    airlines_id: DataTypes.INTEGER,
    depatur_time: DataTypes.TIME,
    arrival_time: DataTypes.TIME,
    duration_time: DataTypes.STRING,
    price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Search',
  });
  return Search;
};