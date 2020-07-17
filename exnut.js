const exnut = require("express")();
const config = require("./conf/config");
const users = require("./conf/users");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

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

exnut.use(passport.initialize());
exnut.use(passport.authenticate("basic", {session: false}));
passport.use(new BasicStrategy(verifyUser));

exnut.get("/", (req, res) => {res.send("Hello World!");});

exnut.listen(config.server.port, () => console.log(`exnut server started listening on port ${config.server.port}`));

/* TODO
 * 1) Add server endpoints expected from a NUT server
 * 2) Proper NUT like USB communication with Tinfoil client locally connected
 * ~~3) Add auth system for all requests~~ Implemented with passport/passport-http
 * 4) Add proper support for ranged/chunked downloads
 * 5) wowsuchdoge/doge like (but better) front end with ReactJS
 */