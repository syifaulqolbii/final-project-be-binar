const { User, Transaction, Flight } = require("../db/models");

module.exports = {
  getUser: async (req, res, next) => {
    try {
      const user = await User.findAll();

      return res.status(200).json({
        status: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  getTransaction: async (req, res, next) => {
    try {
      Transaction.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password", "role", "createdAt", "updatedAt"],
            },
          },
          {
            model: Flight,
            as: "flight",
            attributes: { exclude: ["user_id", "createdAt", "updatedAt"] },
          },
        ],
      })
        .then((transaction) => {
          if (transaction.length < 1) {
            error;
          }
          res.json({
            message: `Transactions data has been found`,
            success: true,
            data: transaction,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: "Transaction is Not Found",
            success: false,
            data: {},
          });
        });
    } catch (err) {
      next(err);
    }
  },
  getRoute: async (req, res, next) => {
    try {
      const route = await Flight.findAll();

      return res.status(200).json({
        status: true,
        data: route,
      });
    } catch (error) {
      next(err);
    }
  },
};
