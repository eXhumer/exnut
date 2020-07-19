const exnut = require("express")();
const config = require("./server/config");
const router = require("./server/router");

exnut.use(router);

exnut.listen(config.server.port, config.server.hostname, () => console.log(`exnut server started on http://${config.server.hostname}:${config.server.port}/`));