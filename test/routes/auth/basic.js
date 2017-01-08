require("should");
var Request = require("supertest");
var Account = require("sinau-modules").test.data.auth.account;
var config = require("../../../config");
const host = `${config.ip}:${config.port}`;
var request = Request(host);

module.exports = function() {

    it("#01. Should be able to authenticate", function(done) {
        Account.getTestData()
            .then((account) => {
                request
                    .post("/authenticate")
                    .send({
                        username: account.username,
                        password: "Standar123"
                    })
                    .expect(200)
                    .end(function(err, response) {
                        if (err)
                            done(err);
                        else {
                            var result = response.body;
                            result.should.have.property("apiVersion");
                            result.should.have.property("data");
                            // result.data.should.instanceOf(Array);
                            done();
                        }
                    });
            });
    });
};
