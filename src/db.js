module.exports = {
    get: function() {
        var factory = require("mongo-factory");
        return factory.getConnection(process.env.DB_CONNECTIONSTRING);
    }
};
