const express = require('express')
const router = express.Router()
const con = require('../controllers')
const mid = require('../helpers/middlewere')
const rbac = require('../middleware/rbac')
const { MODUL } = require('../utils/enum')
// const { User } = require('../db/models')


router.get('/', con.auth.hello)

router.get('/access', mid.cekLogin, rbac(MODUL.UserDashboard, true, true), con.auth.hello)
router.get('/access-admin', mid.cekLogin, rbac(MODUL.AdminDashboard, true, true), con.auth.hello)
router.get('/access-denied', mid.cekLogin, rbac(MODUL.UserDashboard), con.auth.hello)

router.post('/auth/register', con.auth.register);
router.post('/auth/login', con.auth.login)
router.get('/auth/whoami', mid.cekLogin, con.auth.whomami)

router.get('/home/:id', con.hom.getData)
router.post('/home', con.hom.create)
router.put('/home', con.hom.update)
router.delete('/home', con.hom.delete)

router.get('/passenger', con.pas.index)
router.post('/passenger', con.pas.create)
router.put('/passenger', con.pas.update)
router.delete('/passenger', con.pas.delete)

router.get('/airlines', con.air.index)
router.post('/airlines', con.air.create)
router.put('/airlines', con.air.update)
router.delete('/airlines', con.air.delete)

router.get('/order', con.ord.index)
router.post('/order', con.ord.create)
router.put('/order', con.ord.update)
router.delete('/order', con.ord.delete)

router.get('/transaction', con.trans.getData)
router.post('/transaction', con.trans.create)
router.put('/transaction', con.trans.update)
router.delete('/transaction', con.trans.delete)

router.get('/notification', con.not.getData)
router.post('/notification', con.not.create)
router.put('/notification', con.not.update)
router.delete('/notification', con.not.delete)

router.get('/search/:id', con.sc.getData)
router.post('/search', con.sc.create)
router.put('/search', con.sc.update)
router.delete('/search', con.sc.delete)

router.get('/history', con.his.getData)
router.post('/history', con.his.create)
router.put('/history', con.his.update)
router.delete('/history', con.his.delete)

module.exports = router