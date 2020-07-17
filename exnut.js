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