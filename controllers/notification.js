const { Notification } = require('../db/models')

module.exports = {
    getData: async (req, res, next) => {
        try {
            const notification = await Notification.findAll();

            return res.status(200).json({
                data: notification
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id } = req.params;

            const existNotification = await Notification.findOne({ where: {id: id }});

            if (!existNotification){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const notification = await Notification.update({
                isRead : true
            },
            {
                where:{
                    id
                }
            });
            const updateNotif = await Notification.findOne({ where: {id: id }});
            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    id : updateNotif.id,
                    isRead : updateNotif.isRead
                }
            });
        }catch(err){
            next(err);
        }
    },
}