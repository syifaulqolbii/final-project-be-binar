const { User } = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const roles = require('../utils/roles')
const util = require('../utils');


const {
    JWT_SECRET_KEY,
    
} = process.env

module.exports = {
    register: async (req, res, next) => {
        try{
            const { name, email, password, gender, phone} = req.body;

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
                    message: 'email is not valid'
                })
            };
            let strongRegex = /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$/
            if (!password.match(strongRegex)){
                return res.status(400).json({
                    message: 'password must have Capital, number and special character(minimum 8 character) '
                })
            };
            let cekPhone = /^(?=.*[0-9])\d{11,}$/
            if (!phone.match(cekPhone)) {
                return res.status(400).json({
                    message: 'Phone number  needs to be atleast 11 characters'
                })
            }
            
            //const payload = { email: user.email };
            //const token = jwt.sign(payload, JWT_SECRET_KEY);

            const user = await User.create({
                name,
                email,
                password: encryptPassword,
                role: 'Buyer',
                gender,
                phone,
                //confirmationCode: token
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

            if (user.status != "Active") {
                return res.status(401).json({
                    status: false,
                    message: "Pending Account. Please Verify Your Email"
                })
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
                role: user.role,
                gender: user.gender,
                phone: user.phone
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
    whoami: (req, res, next) => {
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
    verifyUser: async (req, res, next) => {
        try {
            const { confirmationCode } = req.params;

            const user = await User.findOne({ where: {confirmationCode: confirmationCode }});
            
            if (!user) {
                return res.status(404).json({
                    message: "User Not found."
                });
            }

            user.status = "Active";
            user.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: err
                    });
                }
            })

        } catch(err) {
            next(err);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({
                    messsage: "Email Not Found!"
                })
            }
            if (user) {
                const payload = { user_id: user.id };
                const token = jwt.sign(payload, JWT_SECRET_KEY);
                const link = `https://backend-4-staging.up.railway.app/auth/reset-password?token=${token}`;

                htmlEmail = await util.email.getHtml('reset-password.ejs', { name: user.name, link: link });
                await util.email.sendEmail(user.email, 'Reset your password', htmlEmail);
            }

            return res.render('auth/forgot-password', { message: 'we will send email for reset password if the email is exist on our database!' });
        } catch (err) {
            next(err);
        }
    },
    forgotPasswordView: (req, res) => {
        return res.render('auth/forgot-password', { message: null });
    },
    resetPassword: async (req, res, next) => {
        try {
            const { token } = req.query;
            const { new_password, confirm_new_password } = req.body;

            console.log('TOKEN :', token);

            if (!token) return res.render('auth/reset-password', { message: 'invalid token', token });
            if (new_password != confirm_new_password) return res.render('auth/reset-password', { message: 'password doesn\'t match!', token });

            const payload = jwt.verify(token, JWT_SECRET_KEY);

            const encryptedPassword = await bcrypt.hash(new_password, 10);

            const user = await User.update({ password: encryptedPassword }, { where: { id: payload.user_id } });

            return res.render('auth/login', { error: null });
        } catch (err) {
            next(err);
        }
    },
    resetPasswordView: (req, res) => {
        const { token } = req.query;
        return res.render('auth/reset-password', { message: null, token });
    },
    hello: (req, res)=>{
        return res.status(200).json({
            message: 'Hello World!!!'
        })
    },
    me: async (req, res) =>{

    }
}