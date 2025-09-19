const express = require("express");
const router = express.Router();
const dealController = require("./dealController");

// POST /api/deals
router.post("/", dealController.getDeals);

module.exports = router;
