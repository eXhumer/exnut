const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const USER_PATH = path.join(__dirname, "conf/user.conf");
const users = JSON.parse(fs.readFileSync(USER_PATH), "utf-8");

module.exports = {
    getUser: username => {
        for (const user of users) {
            if(username === user.username) {
                return user;
            }
        }
        return false;
    },
    checkUserPassword: (passhash, password) => {
        return bcrypt.compareSync(password, passhash);
    }
};