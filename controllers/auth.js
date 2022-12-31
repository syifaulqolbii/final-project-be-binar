const { User } = require('../db/models')
const googleOauth2 = require('../utils/oauth/google')
const { Notification } = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userType = require('../utils/oauth/enum')
const roles = require('../utils/roles')
const mail = require('../utils/oauth/email');
const util = require('../utils');
const user = require('../db/models/user')


const {
    JWT_SECRET_KEY,
    GOOGLE_REDIRECT_URI,
    BACKEND_SERVER,
    FRONTEND_SERVER

} = process.env

module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, gender, phone } = req.body;

            const existUser = await User.findOne({ where: { email: email } });
            if (existUser) {
                if (existUser.user_type != userType.basic) {
                    return res.status(400).json({
                        status: true,
                        message: `your account is associated with ${existUser.user_type} oauth`,
                        data: null
                    })
                }
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
                role: roles.buyer,
                gender,
                phone,
                isVerified: false,
                user_type: userType.basic
            });

            const payload = {
                user_id: user.id,
                email: user.email,
                isVerified: user.isVerified,
                userType: user.user_type
            }

            const token = jwt.sign(payload, JWT_SECRET_KEY);
            const link = `${BACKEND_SERVER}/auth/verify-account?token=${token}`;

            htmlEmail = await mail.getHtml('verify-email.ejs', 
                { 
                    name: name,
                    link: link
                });
            await mail.sendEmail(user.email, '[Verify]', htmlEmail);

            return res.status(201).json({
                status: true,
                message: 'Succes',
                data: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
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
                    message: 'user not found!',
                    data: null
                });
            }
            if(user.user_type != userType.basic) {
                return res.status(400).json({
                    status: false,
                    message: `your account is associated  with ${user.user_type} oauth`
                })
            }
            
            if(user.isVerified != true) {
                return res.status(400).json({
                    status: false,
                    message: 'your account not verified'
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
    google: async (req, res, next) => {
        try {
            const code = req.query.code;

            if (!code) {
                const url = googleOauth2.generateAuthURL();
                return res.redirect(url);
            }

            await googleOauth2.setCredentials(code);

            const { data } = await googleOauth2.getUserData();

            var user = await User.findOne({ where: { email: data.email } });

            if (!user) {
                user = await User.create({
                    name: data.name,
                    email: data.email,
                    gender: data.gender,
                    role: roles.buyer,
                    isVerified: true,
                    user_type: userType.google
                });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role,
                isVerified: user.isVerified,
                user_type: user.user_type,
            };
            const token = jwt.sign(payload, JWT_SECRET_KEY);

            const valid = jwt.verify(token, JWT_SECRET_KEY)

            if (!valid) {
                return res.status(409).json({ status: false, message: 'you are not authorized!' })
            }

            return res.redirect(`${FRONTEND_SERVER}/save-token-google?code=${token}`)

            // return res.status(200).json({
            //     status: true,
            //     message: 'success',
            //     data: {
            //         name: user.name,
            //         role: user.role,
            //         token
            //     }
            // });
        } catch (err) {
            next(err);
        }
    },
    whoami: async(req, res, next) => {
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
    verifyAccount: async(req, res, next) => {
        try {
            const token  = req.query.token;
            
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
                isVerified: true
            }, {
                where: { id: payload.user_id }
            });

            return res.redirect(`${FRONTEND_SERVER}/login`)


        } catch(err) {
            next(err);
        }
    },
    verifyAccountView: (req, res) => {
        const { token } = req.query;
        return res.render('auth/verify-account', { message: null, token });
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
            const link = `${BACKEND_SERVER}/auth/reset-password?token=${token}`;

            htmlEmail = await mail.getHtml('reset-password.ejs', 
                { 
                    name: user.name,
                    link: link
                });
            await mail.sendEmail(user.email, '[Verify]', htmlEmail);

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

            let strongRegex = /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$/
            if (!new_password.match(strongRegex)) {
                return res.status(400).json({
                    message: 'password must have Capital, number and special character(minimum 8 character) '
                })
            };

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
    editProfile: async (req, res) => {
        const id = req.user.id
        const { name, phone, gender } = req.body

        try {
            const userUpdate = await User.update({
                name,
                phone,
                gender
            },
            {
                where:{
                    id : id
                }
            });

            const updatedUser = await User.findOne({
                where:{
                    id : id
                }
            });

            payload = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                gender: updatedUser.gender,
                phone: updatedUser.phone
            }

            const token = jwt.sign(payload, JWT_SECRET_KEY)

            return res.status(201).json({
                status: true,
                message: 'Succes Update Data',
                data: {
                    updatedUser,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }
}