const router = require('express').Router();

const { redirection_controller } = require("../controllers/home_controller");

router.get("/", redirection_controller);

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022