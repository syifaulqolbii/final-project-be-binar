const { User } = require('../db/models')
const googleOauth2 = require('../utils/google')
const { Notification } = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const roles = require('../utils/roles')
const util = require('../utils');


const {
    JWT_SECRET_KEY,
    GOOGLE_REDIRECT_URI,
    SERVER

} = process.env

module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, gender, phone } = req.body;

            const existUser = await User.findOne({ where: { email: email } });
            if (existUser) {
                return res.status(400).json({
                    status: false,
                    message: 'email already used!'
                });
            }

            const encryptPassword = await bcrypt.hash(password, 10);
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(regex)) {
                return res.status(400).json({
                    message: 'email is not valid'
                })
            };
            let strongRegex = /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$/
            if (!password.match(strongRegex)) {
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
            const user = await User.create({
                name,
                email,
                password: encryptPassword,
                role: 'Buyer',
                gender,
                phone
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
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email: email } })
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
    google: async (req, res, next) => {
        // try {
        //     const code = req.query.code;

        //     if (!code) {
        //         const url = googleOauth2.generateAuthURL();
        //         return res.redirect(url);
        //     }

        //     await googleOauth2.setCredentials(code);

        //     const { data } = await googleOauth2.getUserData();

        //     const userExist = await User.findOne({ where: { email: data.email } });

        //     if (!userExist) {
        //         userExist = await User.create({
        //             name: data.name,
        //             email: data.email,
        //             user_type: userType.google
        //         });
        //     }

        //     const payload = {
        //         id: userExist.id,
        //         name: userExist.name,
        //         email: userExist.email,
        //         user_type: userExist.user_type,
        //     };
        //     const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

        //     return res.status(200).json({
        //         status: true,
        //         message: 'success',
        //         data: {
        //             user_id: userExist.id,
        //             token
        //         }
        //     });
        // } catch (err) {
        //     next(err);
        // }
    },
    whoami: async(req, res, next) => {
        const user = req.user

        // //Create
        // const notification = await Notification.create({
        //     user_id: user.id,
        //     data : "haiiii",
        //     tittle : `Hello ${user.id}!!` ,
        //     description : "Welcome to Antariksa, Happy Flight Everywhere",
        //     isRead: false
        // });

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
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'Email not found!'
                })
            }
            const payload = { 
                user_id: user.id,
                name: user.name,
                email: user.email 
            };
            const token = jwt.sign(payload, JWT_SECRET_KEY);
            //const link = `${GOOGLE_REDIRECT_URI}/auth/reset-password?token=${token}`;

            console.log(SERVER);

            await util.email.sendEmail(email, '[Forgot Password]', `<a href='${SERVER}/reset-pass?token=${token}'>click here to reset your password</a>`)

            return res.status(200).json({
                status: true,
                message: 'Succes, cek your email!',
                //data: user 
            });
        } catch (err) {
            next(err);
        }
    },
    // forgotPasswordView: (req, res) => {
    //     return res.res('auth/forgot-password', { message: null });
    // },
    resetPassword: async (req, res, next) => {
        try {
            const token = req.query.token;
            const { new_password, confirm_new_password } = req.body;

            if(new_password !== confirm_new_password) {
                return res.status(422).json({
                    status: false,
                    message: 'new password and confirm new password doesnt match'
                });
            }

            const payload = jwt.verify(token, JWT_SECRET_KEY);

            const user = await User.findOne({ where: { id: payload.user_id } });
            
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'User not found',
                    data: null,
                });
            }

            const isUpdated = await User.update({
                password: await bcrypt.hash(new_password, 10)
            }, {
                where: { id: payload.user_id }
            });

            return res.status(200).json({
                status: true,
                message: 'Change password success',
                data: isUpdated
            });
        } catch (err) {
            next(err);
        }
    },
    resetPasswordView: (req, res) => {
        const { token } = req.query;
        return res.render('auth/reset-password', { message: null, token });
    },
    hello: (req, res) => {
        return res.status(200).json({
            message: 'Hello World!!!'
        })
    },
    me: async (req, res) => {

    }
}