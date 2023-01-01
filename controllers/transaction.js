const { Transaction, Passenger, Order, Flight,transactionMapping, User, Notification } = require('../db/models')
const { use } = require('../routes')

module.exports = {
    // getData: async(req, res, next) => {
    //     try {
    //         // Transaction.findOne({where: {id: req.params.id}, 
    //         //     include: [
    //         // {
    //         //     model: Passenger,
    //         //     as: 'passenger',
    //         //     attributes: {exclude: ["identity_exp_date","createdAt","updatedAt"]}
    //         // },
    //         // {
    //         //     model: Order,
    //         //     as: 'order',
    //         //     attributes: {exclude: ["createdAt","updatedAt"]} 
    //         // }],
    //         //     attributes: {exclude: ["createdAt","updatedAt"]}
    //         // })
    //         // .then(transaction => {
    //         //     if(transaction.length < 1) {
    //         //         error
    //         //     }
    //         //     res.json({message: `Transactions data ${req.params.id} has been found`, success: true, data: {transaction}})
    //         // })
    //         // .catch(err => {
    //         //     console.log(err)
    //         //     res.json({message: "Transaction is Not Found", success: false, data: {}})  
    //         // })

    //     } catch (err) {
    //         next(err)
    //     }
    // },
    getTicket: async( req, res, next) => {
        Flight.findOne({ where: {id: +req.params.id}})
        .then((ticket) =>{
            console.log(ticket)
            return res.json({
                data: {
                    ticket
                    
                }
            })
        })

    },
    create: async (req, res, next) => {
        try {
            let statusPassengers = true
            const  dataPassengers  = req.body.passangers
            const user = req.user
            const flightId = +req.body.id
            if(!user.id){
                return res.json({
                    status: false,
                    message: "You are not logged in"
                })
            }
            if (dataPassengers.length == 0){
                statusPassengers = false
                res.json({message: "Passenger is not found", success: false, data: {}})
            }else{
                dataPassengers.forEach(element => {
                    if(element.name_passenger == null || element.name_passenger == "" ){                        
                        statusPassengers = false
                        return res.status(400).json({
                            message: 'Name Passenger is still empty'
                        })
                    }
                    else if (element.identity_number == null || element.identity_number == "") {    
                        statusPassengers = false                    
                        return res.status(400).json({
                            message: 'Identity Number is still empty'
                        })
                    }
                    else if (element.identity_type == "Passport" && element.identity_exp_date == "") {                        
                        statusPassengers = false
                        return res.status(400).json({
                            message: 'Identity exp date is still empty'
                        })
                    }
                    else if (element.nationality == null || element.nationality == "") {
                        statusPassengers = false
                        return res.status(400).json({
                            message: 'Nationality is still empty'
                        })
                    }
                    else if (element.identity_type == null || element.identity_type == "") {
                        statusPassengers = false
                        return res.status(400).json({
                            message: 'Identity Type is still empty'
                        })
                    }else if(element.identity_type == "KTP"){
                        let cekIdentity = /^(?=.*[0-9])\d{16,}$/
                        if (!element.identity_number.match(cekIdentity)) {
                            statusPassengers = false
                            return res.status(400).json({
                                message: 'Identity number of KTP must number and have 16 character'
                            })
                        }
                    }else if (element.identity_type == "Passport"){
                        let cekIdentity = /^[a-z0-9]{10}$/i;
                        if (!element.identity_number.match(cekIdentity)) {
                            statusPassengers = false
                            return res.status(400).json({
                                message: 'Identity number of Passport must be a number and letter 10 character'
                            })
                        }
                    }else{
                        statusPassengers = false
                        return res.status(400).json({
                            message: 'Identity not found'
                        })
                    }
                })    
            }
            if(statusPassengers){
                const transaction = await Transaction.create({
                    FlightId: flightId,
                    UserId: user.id
                })
                console.log(user.id, user.name)
                dataPassengers.forEach(element => {
                    let PassengerId = element.PassengerId
                    if(!PassengerId){
                        
                        const passenger = Passenger.create({
                            name_passenger: element.name_passenger, 
                            identity_number: element.identity_number, 
                            identity_exp_date: element.identity_exp_date, 
                            nationality: element.nationality, 
                            identity_type: element.identity_type
                        })
                        .then((Passenger) =>{
                            PassengerId = Passenger.id
                            const transactioniMapping = transactionMapping.create({
                                UserId: user.id,
                                TransactionId: transaction.id,
                                PassengerId: Passenger.id
                            })
                        })
                        
                    }    
            
            })
            if (dataPassengers.length == 0){
                res.json({message: "Passenger is not found", success: false, data: {}})
            }
            const notification = await Notification.create({
                user_id: user.id,
                tittle: `Hello ${user.name}!!`,
                description:
                  `Transaksi kamu dengan nomor ${transaction.id} telah berhasil
                  Silahkan cek tiket di email anda dan cek klik notif ini untuk melihat detail history`,
                isRead: false,
              });

            const transactions = await transactionMapping.findAll({
                where: {TransactionId: transaction.id},
                include: [
                    {
                        model: Passenger,
                        as: "passenger",
                        attributes: {exclude: ["createdAt","updatedAt"]}
                    },
                    {
                        model: Flight,
                        as: "flight",
                        attributes: {exclude: ["createdAt","updatedAt"]}
                    },
                ]
            })
            if(transactions != 0){
                const user = await User.findOne({ where: { id: user.id} });
                htmlEmail = await mail.getHtml('transaction.ejs', 
                { 
                    passengerData: transactions
                });
                await mail.sendEmail(user.email, '[Ticket]', htmlEmail);
            }
            
            return res.status(201).json({
                status: true,
                message: 'Succes Create Booking',
            });
            

            }
            
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, PassengerId, OrderId } = req.body;

            const existTransaction = await Transaction.findOne({ where: {id: id }});
            if (!existTransaction){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const transaction = await Transaction.update({
                PassengerId,
                OrderId
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: true,
                message: 'Succes',
                data: transaction
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Transaction.destroy({
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

// test