const express = require('express')
const router = express.Router()
const con = require('../controllers')
const mid = require('../helpers/middlewere')

router.post('/auth/register', con.auth.register);
router.post('/auth/login', con.auth.login)
router.get('/auth/whoami', mid.cekLogin, con.auth.whomami)

module.exports = router