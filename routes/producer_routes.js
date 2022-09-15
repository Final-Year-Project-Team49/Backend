const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const { request_validator } = require("../utils/validator");
const{
    check_auth,
    check_producer,
} = require('../controllers/auth_controller');
const {
    display_producer_page,
    producer_update_info,
    display_farm_produce_registration_page,
    register_farm_produce,
    display_update_info_page
} = require('../controllers/producer_controller');

//Route to update the producer details
router.get("/",
    check_auth,
    check_producer,
    display_producer_page,
)

router.get("/update_info",
    check_auth,
    check_producer,
    display_update_info_page,
)

router.post('/update_info',
    check_auth,
    check_producer,
    [
        body("address").exists().withMessage("Address is required"),
        body("pincode").exists().withMessage("Pincode is required"),
    ],
    request_validator,
    producer_update_info
);

router.get("/register_farm_produce",
    check_auth,
    check_producer,
    display_farm_produce_registration_page,
)

router.post("/register_farm_produce",
    check_auth,
    check_producer,
    [
        body("name").exists().withMessage("Name is required"),
    ],
    request_validator,
    register_farm_produce
)

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022