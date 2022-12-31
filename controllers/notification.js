const { Notification } = require("../db/models");
const notification = require("../db/models/notification");

module.exports = {
  getData: async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const notification = await Notification.findAll({
        where: { user_id: user_id },
        order: [
          ['createdAt', 'DESC']
        ]
      });

      // sorting
      // const data = JSON.parse(JSON.stringify(notification));
      // data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      // console.log(data.record);

      return res.status(200).json({
        data: notification
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const user = req.user;
      const notification = await Notification.create({
        user_id: user.id,
        tittle: `Hello ${user.name}!!`,
        description:
          "Terima kasih telah membeli tiket, silahkan cek tiket anda di email atau dihalaman history pembelian",
        isRead: false,
      });
      return res.status(201).json({
        status: true,
        message: "Succes",
        data: {
          user_id: notification.user_id,
          tittle: notification.tittle,
          description: notification.description,
          isRead: notification.isRead,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existNotification = await Notification.findOne({
        where: { id: id },
      });

      if (!existNotification) {
        return res.status(400).json({
          status: false,
          message: "data is not found",
        });
      }
      const notification = await Notification.update(
        {
          isRead: true,
        },
        {
          where: {
            id,
          },
        }
      );
      const updatedNotif = await Notification.findOne({ where: { id: id } });
      return res.status(201).json({
        status: true,
        message: "Succes",
        data: {
          id: updatedNotif.id,
          isRead: updatedNotif.isRead,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
