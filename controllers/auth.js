const { User } = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { use } = require('../routes')

const {
    JWT_SECRET_KEY
} = process.env

module.exports = {
    register: async (req, res, next) => {
        try{
            const { name, email, password } = req.body;

            const existUser = await User.findOne({ where: {email: email }});
            if (existUser){
                return res.status(400).json({
                    status: false,
                    message: 'email already used!'
                });
            }

            const encryptPassword = await bcrypt.hash(password, 10);
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(regex)){
                return res.status(400).json({
                    message: 'email not match'
                })
            };
            const user = await User.create({
                name,
                email,
                password: encryptPassword
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    email: user.email,
                    name: user.name
                }
            });
        }catch(err){
            next(err);
        }
    },
    login: async(req, res, next) =>{
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where : {email: email}})
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'email not found!'
                });
            }

            const isPassCorrect = await bcrypt.compare(password, user.password)
            if (!isPassCorrect) {
                return res.status(404).json({
                    status: false,
                    message: 'password is not correct'
                });
            }

            payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
            const token = jwt.sign(payload, JWT_SECRET_KEY)

            return res.status(201).json({
                status: false,
                data: {
                    token: token
                }
            })
        } catch (error) {
            next(error)
        }
    },
    whomami: (req, res, next) => {
        const user = req.user

        try {
            return res.status(200).json({
                status: false,
                message: 'succes',
                data: user
            })
        } catch (err) {
            next(err);
        }
    },
    hello: (req, res)=>{
        return res.status(200).json({
            message: 'Hello World!!!'
        })
    },
    me: async (req, res) =>{

    }
}