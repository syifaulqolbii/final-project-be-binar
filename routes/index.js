const express = require('express')
const router = express.Router()
const con = require('../controllers')
const mid = require('../helpers/middlewere')
const rbac = require('../middleware/rbac')
const restrict = require('../middleware/restrict')
const { MODUL } = require('../utils/enum')
// const { User } = require('../db/models')

router.get('/access', mid.cekLogin, rbac(MODUL.UserDashboard, true, true), con.auth.hello)
router.get('/access-admin', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true), con.auth.hello)
router.get('/access-denied', mid.cekLogin, rbac(MODUL.UserDashboard), con.auth.hello)

router.post('/auth/register', con.auth.register);
router.post('/auth/login', con.auth.login)
router.get('/auth/loginGoogle', con.auth.google);
// router.post("/auth/loginAdmin", con.auth.loginAdmin)
router.get('/auth/whoami', mid.cekLogin, con.auth.whoami)


//router.get('/auth/forgot-password', con.auth.forgotPasswordView);
router.post('/auth/forgot-password', con.auth.forgotPassword);

router.get('/auth/reset-password', con.auth.resetPasswordView);
router.post('/auth/reset-password', con.auth.resetPassword);

// list airport
router.get('/list-airport', con.list.getListAirport);
router.post('/create/list-airport', con.list.createListAirport);

router.get('/search?', con.fli.getSearch)
router.post('/route', mid.cekLogin,rbac(MODUL.AdminDashboard, true, true), con.fli.create)
router.put('/editFlight/:id', mid.cekLogin,con.fli.update)
router.delete('/flight/:id', mid.cekLogin,con.fli.delete)
router.get('/flight/getById/:id', mid.cekLogin,con.fli.getRouteById)


router.delete('/passenger',mid.cekLogin,con.pas.delete)

router.get('/transaction-ticket/:id', mid.cekLogin, con.trans.getTicket)
router.post('/transaction',  mid.cekLogin, con.trans.create)
router.put('/transaction', con.trans.update)
router.delete('/transaction', con.trans.delete)


router.get('/access', mid.cekLogin, rbac(MODUL.UserDashboard, true, true), con.auth.hello)
router.get('/access-admin', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true), con.auth.hello)
router.get('/access-denied', mid.cekLogin, rbac(MODUL.UserDashboard), con.auth.hello)


router.get('/notification', mid.cekLogin, rbac(MODUL.UserDashboard, true, true),con.not.getData)
// router.post('/notification', mid.cekLogin, rbac(MODUL.UserDashboard, true, true),con.not.create)
router.put('/notification/:id', mid.cekLogin, rbac(MODUL.UserDashboard, true, true), con.not.update)


router.get('/history', mid.cekLogin, con.his.getData)
router.get('/history-detail/:id', mid.cekLogin, con.his.getDetail)

router.get('/admin/get-user', mid.cekLogin,con.admin.getUser)
router.get('/admin/get-transaction', mid.cekLogin, con.admin.getTransaction)
router.get('/admin/get-route', mid.cekLogin, con.admin.getRoute)
module.exports = router
