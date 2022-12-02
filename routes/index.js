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
router.get('/auth/whoami', mid.cekLogin, con.auth.whomami)

module.exports = router