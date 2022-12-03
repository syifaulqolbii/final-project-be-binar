const { User } = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const roles = require('../utils/roles')


const {
    JWT_SECRET_KEY,
    
} = process.env

module.exports = {
    register: async (req, res, next) => {
        try{
            const { name, email, password, role = roles.buyer } = req.body;

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
                password: encryptPassword,
                role
            });


            return res.status(201).json({
                status: true,
                message: 'Succes',
                data: {
                    email: user.email,
                    name: user.name,
                    role: user.role
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
                status: true,
                data: {
                    token: token,
                    role: user.role
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
                status: true,
                message: 'succes',
                data: user
            })
        } catch (err) {
            next(err);
        }
    },
    loginAdmin: async(req, res, next)=> {
        try {
            const {email, password} = req.body

            const admin = await User.findOne({where: {email: email}})
            if(!admin){
                return res.status(404).json({
                    status: false,
                    message: "email not found"
                })
            }
            if(admin.role != "Admin"){
                return res.status(404).json({
                    status: false,
                    message: "you are not admin"
                })
            }
            const isPassCorrect = await bcrypt.compare(password, admin.password)
            if (!isPassCorrect) {
                return res.status(404).json({
                    status: false,
                    message: 'password is not correct'
                });
            }
            payload = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
            const token = jwt.sign(payload, JWT_SECRET_KEY)

            return res.status(201).json({
                status: true,
                data: {
                    token: token,
                    role: admin.role
                }
            })

        } catch (error) {
            next(error)
        }
    },
    forgotPassword: async(req, res, next) => {
        try {
            const {email} = req.body;

            const user = await User.findOne({where: {email}});
        if(user){
            const payload = {user_id: user.id};
                 const token = jwt.sign(payload, JWT_SECRET_KEY);
                 const link = `https://backend-4.up.railway.app/`

                 htmlEmail = await util.email.getHtml('reset-password.ejs', {name: user.name, link: link});
                 await util.email.sendEmail(user.email, 'Reset your password', htmlEmail);
             }
             return res.render('auth/forgotPassword', { message: 'we will send email for reset'});
         } catch (error) {
             next(error)
         }
     },
     forgotPasswordView: (req, res) => {
         return res.render('auth/forgot-password', {message: null});
     },
     resetPassword: async (req, res, next) => {
        try {
            const { oldPassword, newPassword, confirmNewPassword } = req.body;

            if (newPassword !== confirmNewPassword) {
                return res.status(422).json({
                    status: false,
                    message: 'new password and confirm new password doesn\'t match!'
                });
            }
            const user = await User.findOne( { where: { username: req.user.username } });
            if (!user) return res.status(404).json({
                success: false,
                message: 'User not found!'
            });

            const correct = await bcrypt.compare(oldPassword, user.password);
            if(!correct) {
                return res.status(400).json({
                    status: false,
                    message: 'old password doesn\'t match! '
                });
            }

            const encryptPassword = await  bcrypt.hash(newPassword, 10);
            const updateUser = await User.update({
                password: encryptPassword
            }, {
                where: {
                    id: user.id
                }
            });

            return res.status(200).json({
                status: false,
                message: 'success',
                data: updateUser
            });
        } catch(err) {
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