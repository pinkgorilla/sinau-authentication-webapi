var config = require("../config");

module.exports = {
    get: function() {
        var factory = require("mongo-factory");
        return factory.getConnection(config.mongo.connectionstring);
    }
}