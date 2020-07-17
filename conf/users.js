const bcrypt = require("bcrypt");

const users = [
    {
        username: "guest",
        passhash: "$2b$12$ugY8/RzW/wo8q756DGUAZOyW9l1L9P03zLU/iLYb.B7kYM9zHDHLm" // guest (bcrypt with 12 salt rounds)
    }
];

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