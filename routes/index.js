const express = require('express')
const router = express.Router()
const con = require('../controllers')
const mid = require('../helpers/middlewere')
const rbac = require('../middleware/rbac')
const restrict = require('../middleware/restrict')
const { MODUL } = require('../utils/enum')
// const { User } = require('../db/models')

router.get('/', con.auth.hello)
router.get('/access', restrict, rbac(MODUL.UserDashboard, true, true), con.auth.hello)
router.get('/access-admin', restrict, rbac(MODUL.AdminDashboard, true, true), con.auth.hello)
router.get('/access-denied', restrict, rbac(MODUL.UserDashboard), con.auth.hello)

router.post('/auth/register', con.auth.register);
router.post('/auth/login', con.auth.login)
router.post("/auth/loginAdmin", con.auth.loginAdmin)
router.get('/auth/whoami', mid.cekLogin, con.auth.whoami)


router.get('/auth/forgot-password', con.auth.forgotPasswordView);
router.post('/auth/forgot-password', con.auth.forgotPassword);

router.get('/auth/reset-password', con.auth.resetPasswordView);
router.post('/auth/reset-password', con.auth.resetPassword);

// list airport
router.get('/list-airport', con.list.listAirport);


module.exports = router;
