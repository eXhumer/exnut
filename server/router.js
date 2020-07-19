const express = require("express");
const root = require("./route/root");
const api = require("./route/api");

const router = express.Router();

router.use(root);
router.use(api);

module.exports = router;