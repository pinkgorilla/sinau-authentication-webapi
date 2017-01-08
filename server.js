function server() {
    try {
        var restify = require("restify");
        restify.CORS.ALLOW_HEADERS.push("authorization");

        var whitelist = [
            'http://localhost:9000',
        ];
        var corsOptions = {
            origins: whitelist,
            credentials: true
        };

        var passport = require("passport");
        var server = restify.createServer();

        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.use(restify.CORS(corsOptions));
        server.use(passport.initialize());

        server.use(function (request, response, next) {
            var query = request.query;
            query.order = !query.order ? {} : JSON.parse(query.order);
            query.filter = !query.filter ? {} : JSON.parse(query.filter);
            request.queryInfo = query;
            next();
        });

        require("./routes/default")(server);
        require("./routes/v1")(server);

        // server.use(function crossOrigin(req, res, next) {
        //     res.header("Access-Control-Allow-Origin", "http://localhost:9000");
        //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
        //     res.header("Access-Control-Allow-Credentials", true);
        //     return next();
        // })
        server.listen(process.env.PORT, process.env.IP);
        console.log(`auth server created at ${process.env.IP}:${process.env.PORT}`);

        return Promise.resolve(server);
    }
    catch (ex) {
        return Promise.reject(ex);
    }
}

module.exports = server;
