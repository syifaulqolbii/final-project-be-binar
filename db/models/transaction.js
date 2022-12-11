'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Passenger,{ foreignKey: 'PassengerId', as: 'passenger'})
      this.belongsTo(models.Order, {foreignKey: 'OrderId', as: 'order'})
    }
  }
  Transaction.init({
    OrderId: DataTypes.INTEGER,
    PassengerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};