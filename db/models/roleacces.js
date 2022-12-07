'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleAcces extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoleAcces.init({
    user_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    write: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RoleAcces',
  });
  return RoleAcces;
};