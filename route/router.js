const express = require("express");
const root = require("./root");
const api = require("./api");

const router = express.Router();

router.use(root);
router.use(api);

module.exports = router;