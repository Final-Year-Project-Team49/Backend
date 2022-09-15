const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const { request_validator } = require("../utils/validator");
const{
    check_auth,
    check_collection_center,
} = require('../controllers/auth_controller');
const {
    display_collection_center_page,
    display_update_info_page,
    collection_center_update_info,
    display_collect_farm_produce_page,
    collect_farm_produce,
    display_collected_farm_produce_info,
    display_register_hardware_page,
    register_hardware,
} = require('../controllers/collection_center_controller');

// this route displays the collection center page
router.get("/",
    check_auth,
    check_collection_center,
    display_collection_center_page,
)

// this route displays update_info page
router.get("/update_info",
    check_auth,
    check_collection_center,
    display_update_info_page
)

// this route handles the update of collection center info
router.post("/update_info",
    check_auth,
    check_collection_center,
    [
        body("collection_center_name").exists().withMessage("Name is required"),
        body("address").exists().withMessage("Address is required"),
        body("pincode").exists().withMessage("Pincode is required"),
    ],
    request_validator,
    collection_center_update_info,
)

// this route displays the collect farm produce page
router.get("/collect/:farm_produce_id",
    check_auth,
    check_collection_center,
    display_collect_farm_produce_page,
)

// this route handles the collect farm produce request
router.post("/collect/:farm_produce_id",
    check_auth,
    check_collection_center,
    [   
        body("transaction_amount").exists().withMessage("Transaction amount is required"),
        body("notes").exists().withMessage("Notes is required"),
    ],
    request_validator,
    collect_farm_produce,
)

// this route displayes the details of collected farm produce like QR code
router.get("/info/:farm_produce_id",
    check_auth,
    check_collection_center,
    display_collected_farm_produce_info,
)

// display register hardware page
router.get("/register_hardware",
    check_auth,
    check_collection_center,
    display_register_hardware_page,
)

// handle register hardware request
router.post("/register_hardware",
    check_auth,
    check_collection_center,
    [
        body("hardware_id").exists().withMessage("Hardware ID is required"),
        body("hardware_name").exists().withMessage("Hardware Name is required"),
        body("hardware_secret_key").exists().withMessage("Hardware Secret Key is required"),
    ],
    request_validator,
    register_hardware,
)

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022