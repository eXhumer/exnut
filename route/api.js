const fs = require("fs/promises");
const { constants } = require("fs");
const path = require("path");
const express = require("express");
const auth = require("./auth");
const googleDriveService = require("../gdrive");
const config = require("../config");
const titledb = require("../titledb");

const isWindows = process.platform === "win32";

const router = express.Router();

// only use auth if the server is configured to do so
if(config.server.requireAuth)
    router.use(/^\/api\/(.+)/, auth);

router
    .route("/api/user/")
    .get((req, res) => {
        const resObj = { requireAuth: config.server.requireAuth };
        // if auth is required, add id/password along with requireAuth
        if(resObj.requireAuth) {
            const auth = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString("utf-8").split(":");
            Object.assign(resObj, {id: auth[0], password: auth[1]});
        }
        res.json(resObj);
    });

router
    .route("/api/search/")
    .get(async (req, res) => {
        const filesStr = await fs.readFile(__dirname + "/../conf/files.conf", "utf8");
        const files = JSON.parse(filesStr);
        res.json(files);
    });

router
    .route("/api/updateDb/")
    .get((req, res) => {res.send("OK!");});

router
    .route("/api/scan/")
    .get(async (req, res) => {
        let scannedTitles = [];
        let scanPromises = [];
        for (const scanStr of config.paths.scan) {
            const scanPath = path.resolve(scanStr);
            try {
                await fs.access(scanPath, constants.R_OK);
                scanPromises = scanPromises.concat(fs.readdir(scanPath));
            } catch(err) {
                console.log(`Unable to access folder ${scanPath}. Skipping...`);
            }
        }
        if(scanPromises.length > 0) {
            const loadTitleDbSuccess = await titledb.loadTitleDb();
            const scannedFilesArr = await Promise.all(scanPromises);
            const scannedFiles = scannedFilesArr[0];
            const nswRegex = /^(?:([\S]+)\s*)?\[([A-Fa-f\d]{16})\]\s*(?:\[([A-Z]{2})\]\s*)?\[v([\d]+)\](?:\s*\[CR-(\d{2})\])?.(nsp|nsz|xci|xcz)$/;
            scannedTitles = await scannedFiles.reduce(async (res, filePromise) => {
                const file = await filePromise;
                const arr = await res;
                const regexMatch = path.basename(file).match(nswRegex);
                if(regexMatch) {
                    const titleInfo = {id: regexMatch[2], name: file, version: Number(regexMatch[4])};
                    if(loadTitleDbSuccess) {
                        const titleLatestVer = titledb.getTitleLatestVersion(regexMatch[2]);
                        if(titleLatestVer !== null) {
                            Object.assign(titleInfo, {latest: titleLatestVer});
                        }
                    }
                    arr.push(titleInfo);
                }
                return arr;
            }, scannedTitles);
            await fs.writeFile(__dirname + "/../conf/files.conf", JSON.stringify(scannedTitles), "utf8");
        }
        res.json({success: true, result: scannedTitles.length});
    });

router
    .route("/api/gdriveToken/")
    .get(async (req, res) => {
        // try getting the gdrive service for server
        const gdriveService = await googleDriveService();
        if(gdriveService) {
            // if it exists, read credentials/token & send them
            const credentials = JSON.parse(fs.readFileSync(__dirname + "/../conf/credentials.json"));
            const token = JSON.parse(fs.readFileSync(__dirname + "/../conf/gdrive.token"));
            res.json({"access_token": token.access_token, "refresh_token": token.refresh_token, "credentials": credentials});
        } else {
            // send 401
            res.status(401).setHeader().json({success: false, result: "Web server missing Google application credentials"});
        }
    });

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