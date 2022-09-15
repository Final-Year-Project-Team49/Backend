const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const { request_validator } = require("../utils/validator");

const {
    display_signup_page,
    handle_signup,
    display_login_page,
    handle_login,
    check_auth,
    check_customer,
} = require('../controllers/auth_controller');

router.get("/signup", 
    display_signup_page
);

router.post("/signup",
    [
        body("name").exists().withMessage("Name is required"),
        body("email").isEmail().withMessage("Email is required"),
        body("password").exists().withMessage("Password is required"),
        body("role").exists().withMessage("Role is required"),
    ],
    request_validator,
    handle_signup
);

router.get("/login", 
    display_login_page
); 

router.post("/login",
    [
        body("email").isEmail().withMessage("Email is invalid"),
        body("password").isLength({ min: 6 }).withMessage("Password is too short"),
    ],
    request_validator,
    handle_login
);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

//Authentication test route
// router.get("/test", check_auth, check_customer, (req, res) => {
//     res.send(req.user);
// });

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
