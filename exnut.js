const exnut = require("express")();
const config = require("./conf/config");
const root = require("./route/root");
const api = require("./route/api");

exnut.use(root);
exnut.use(api);

exnut.listen(config.server.port, () => console.log(`exnut server started listening on port ${config.server.port}`));