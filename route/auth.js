const express = require("express");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const users = require("../users");

const router = express.Router();

const verifyUser = (username, password, done) => {
    const user = users.getUser(username);
    if(!user) {
        done(null, false);
        return;
    }
    if(!users.checkUserPassword(user.passhash, password)) {
        done(null, false);
        return;
    }
    done(null, user);
};

router.use(passport.initialize());
router.use(passport.authenticate("basic", {session: false}));
passport.use(new BasicStrategy(verifyUser));

module.exports = router;