const express = require('express')
const router = express.Router()
const con = require('../controllers')
const mid = require('../helpers/middlewere')
const rbac = require('../middleware/rbac')
const restrict = require('../middleware/restrict')
const { MODUL } = require('../utils/enum')
// const { User } = require('../db/models')

router.get('/', con.auth.hello)

router.get('/access', mid.cekLogin, rbac(MODUL.UserDashboard, true, true), con.auth.hello)
router.get('/access-admin', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true), con.auth.hello)
router.get('/access-denied', mid.cekLogin, rbac(MODUL.UserDashboard), con.auth.hello)

router.post('/auth/register', con.auth.register);
router.post('/auth/login', con.auth.login)
// router.post("/auth/loginAdmin", con.auth.loginAdmin)
router.get('/auth/whoami', mid.cekLogin, con.auth.whoami)


router.get('/auth/forgot-password', con.auth.forgotPasswordView);
router.post('/auth/forgot-password', con.auth.forgotPassword);

router.get('/auth/reset-password', con.auth.resetPasswordView);
router.post('/auth/reset-password', con.auth.resetPassword);

// list airport
router.get('/list-airport', con.list.listAirport);

// router.get('/home?', con.hom.getData)
router.get('/search?', mid.cekLogin,con.fli.getSearch)
router.post('/route', mid.cekLogin,rbac(MODUL.AdminDashboard, true, true), con.fli.create)
router.put('/flight', mid.cekLogin,con.fli.update)
router.delete('/flight', mid.cekLogin,con.fli.delete)

router.get('/passenger', mid.cekLogin,con.pas.index)
router.post('/passenger', mid.cekLogin,con.pas.create)
router.put('/passenger', mid.cekLogin,con.pas.update)
router.delete('/passenger',mid.cekLogin,con.pas.delete)

// router.get('/airlines', con.air.index)
// router.post('/airlines', con.air.create)
// router.put('/airlines', con.air.update)
// router.delete('/airlines', con.air.delete)

router.get('/order', mid.cekLogin,con.ord.index)
router.post('/order',  mid.cekLogin,con.ord.create)
router.put('/order', mid.cekLogin,con.ord.update)
router.delete('/order', mid.cekLogin,con.ord.delete)

router.get('/transaction/:id', mid.cekLogin, con.trans.getData)
router.post('/transaction', mid.cekLogin,  con.trans.create)
router.put('/transaction', con.trans.update)
router.delete('/transaction', con.trans.delete)


router.get('/access', mid.cekLogin, rbac(MODUL.UserDashboard, true, true), con.auth.hello)
router.get('/access-admin', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true), con.auth.hello)
router.get('/access-denied', mid.cekLogin, rbac(MODUL.UserDashboard), con.auth.hello)


router.get('/notification', con.not.getData)
// router.post('/notification', mid.cekLogin, rbac(MODUL.UserDashboard, true, true),con.not.create)
router.put('/notification/:id', con.not.update)

// router.get('/search/:id', con.sc.getData)

// router.post('/search', mid.cekLogin,rbac(MODUL.AdminDashboard, true, true),con.sc.create)
// router.put('/search', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true),con.sc.update)
// router.delete('/search', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true),con.sc.delete)
// router.post('/search-admin',mid.cekLogin, rbac(MODUL.AdminDashboard, true, true),con.sc.create)


router.get('/history', con.his.getData)
router.post('/history', con.his.create)
router.put('/history', con.his.update)
router.delete('/history/:id', con.his.delete)

router.get('/admin/get-user', con.admin.getUser)
router.get('/admin/get-transaction', con.admin.getTransaction)
module.exports = router
