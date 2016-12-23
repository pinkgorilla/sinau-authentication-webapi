function server() {
    try {
        var restify = require("restify");
        restify.CORS.ALLOW_HEADERS.push("authorization");

        var passport = require("passport");
        var server = restify.createServer();

        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.use(restify.CORS());
        server.use(passport.initialize()); 
        
        server.use(function(request, response, next) {
            var query = request.query;
            query.order = !query.order ? {} : JSON.parse(query.order);
            query.filter = !query.filter ? {} : JSON.parse(query.filter);
            request.queryInfo = query;
            next();
        });

        require("./routes/default")(server);
        require("./routes/v1")(server);

        server.listen(process.env.PORT, process.env.IP);
        console.log(`auth server created at ${process.env.IP}:${process.env.PORT}`);

        return Promise.resolve(server);
    }
    catch (ex) {
        return Promise.reject(ex);
    }
}

module.exports = server;
