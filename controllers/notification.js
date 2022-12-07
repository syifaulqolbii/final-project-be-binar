const { Notification } = require('../db/models')



module.exports = {
    getData: async (req, res, next) => {
        try {
            const notification = await Notification.findAll();

            return res.status(200).json({
                data: order
            });
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { user_id, data, tittle, description, isRead } = req.body;

            //Read
            const existNotification = await Order.findOne({ where: {user_id: user_id }});
            if (existNotification){
                return res.status(400).json({
                    status: false,
                    message: 'data already create'
                });
            }

            //Create
            const notification = await Notification.create({
                user_id,
                data,
                tittle,
                description,
                isRead
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    notification
                }
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, user_id, data, tittle, description, isRead } = req.body;

            const existNotification = await Notification.findOne({ where: {id: id }});
            if (!existNotification){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const notification = await Notification.update({
                user_id,
                data,
                tittle,
                description,
                isRead
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: notification
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Notification.destroy({
                where: {
                    id
                }
            });


            return res.status(201).json({
                message: 'Succes Delete Data'
            });
        }catch(err){
            next(err);
        }
    }
}