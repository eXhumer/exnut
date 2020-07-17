const config = {
    paths: {
        scan: ["."]
    },
    server: {
        // 0.0.0.0 to listen on every net interface
        hostname: "0.0.0.0",
        port: 9000,
        requireAuth: false
    }
};

module.exports = config;