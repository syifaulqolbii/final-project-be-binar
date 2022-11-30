const express = require("express");
const router = express.Router();
const con = require("../controllers");
const mid = require("../helpers/middlewere");
const roles = require("../utils/roles");

// router.get('/auth/forgot-password', con.auth.forgotPasswordView);
// router.post('/auth/forgot-password', con.auth.forgotpassword);

router.post("/auth/register", con.auth.register);
router.post("/auth/login", con.auth.login);

router.post("/auth/loginAdmin", con.auth.loginAdmin)

router.get("/auth/whoami", mid(roles.buyer), con.auth.whomami);

// add only admin can access

// router.post("/test", mid(roles.admin), (req, res, next)=> {
//     return res.send('test role admin')
// })

module.exports = router;
