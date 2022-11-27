const express = require('express')
const router = express.Router()
const con = require('../controllers')
const mid = require('../helpers/middlewere')
const {User} = require('../db/models')

router.get('/',async(req, res, next) => {
    try {
        const user = await User.findAll();
        if(!user.length){
            return res.status(400).json({
                status: false,
                data: null,
                message: "empty data!"
            })
        }
        return res.status(400).json({
            status: true,
            data: 'success',
            message: user
        })
    } catch (error) {
        next(error)
    }
} )
router.post('/auth/register', con.auth.register);
router.post('/auth/login', con.auth.login)
router.get('/auth/whoami', mid.cekLogin, con.auth.whomami)

module.exports = router