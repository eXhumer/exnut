const path = require("path");
const fs = require("fs");

const CONFIG_PATH = path.join(__dirname, "conf/server.conf");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH), "utf-8");

module.exports = {
    ...config,
    addNewScanPath: pathToAdd => {
        if(!(pathToAdd in config.paths.scan) && typeof pathToAdd === "string") {
            config.paths.scan.push(pathToAdd);
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
        }
    }
};