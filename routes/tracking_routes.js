const router = require('express').Router();
const { display_tracking_information, display_tracking_query_page } = require("../controllers/tracking_controllers");

router.get('/', 
    display_tracking_query_page
);

router.get("/:id",
    display_tracking_information
);

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022