'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactionMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Passenger, { foreignKey: 'PassengerId', as: 'passenger' })
    }
  }
  transactionMapping.init({
    UserId: DataTypes.INTEGER,
    TransactionId: DataTypes.INTEGER,
    PassengerId: DataTypes.INTEGER,
    booked_passengers: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactionMapping',
  });
  return transactionMapping;
};