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
      // this.belongsTo(models.Passenger,{ foreignKey: 'PassengerId', as: 'passenger'})
      // this.belongsTo(models.Order, {foreignKey: 'OrderId', as: 'order'})
      this.belongsTo(models.Flight, { foreignKey: 'FlightId', as: 'flight' })
      this.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' })
    }
  }
  Transaction.init({
    UserId: DataTypes.INTEGER,
    FlightId: DataTypes.INTEGER,
    // OrderId: DataTypes.INTEGER,
    // PassengerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};