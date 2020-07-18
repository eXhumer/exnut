const express = require("express");
const auth = require("./auth");
const config = require("../conf/config");

const router = express.Router();

if(config.server.requireAuth)
    router.use(/^\/api\/(.+)/, auth);

router
    .route("/api/user/")
    .get((req, res) => {
        const auth = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString("ucs2").split(":");
        res.json({
            "id": auth[0],
            "password": auth[1],
            "isAdmin": false,
            "remoteAddr": "3",
            "requireAuth": config.server.requireAuth,
            "switchHost": "2",
            "switchPort": 1
        });
    });

router
    .route("/api/search/")
    .get((req, res) => {res.json([{"id": "TITLE_ID", "name": "FILE_NAME", "version": 0}]);});

router
    .route("/api/updateDb/")
    .get((req, res) => {res.send("OK!");});

router
    .route("/api/scan/")
    .get((req, res) => {res.send("OK!");});

router
    .route("/api/gdriveToken/")
    .get((req, res) => {res.json({"access_token": "", "refresh_token": "", "credentials": ""});});

router
    .route("/api/titleImage/:titleId/")
    .get((req, res) => {res.json({"id": req.params.titleId});});

router
    .route("/api/bannerImage/:titleId/")
    .get((req, res) => {res.json({"id": req.params.titleId});});

router
    .route("/api/frontArtBoxImage/:titleId/")
    .get((req, res) => {res.json({"id": req.params.titleId});});

router
    .route("/api/screenshotImage/:titleId/")
    .get((req, res) => {res.json({"id": req.params.titleId});});

module.exports = router;