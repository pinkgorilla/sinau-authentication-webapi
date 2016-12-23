require("should");
const host = `${process.env.IP}:${process.env.PORT}`;
var Request = require("supertest");
var Account = require("sinau-modules").test.data.auth.account;
var request = Request(host);
require("should");
var ObjectId = require("mongodb").ObjectId;
var jwt;

before("#00. get security token", function(done) {
    var getToken = require("../../token");
    getToken()
        .then((token) => {
            jwt = token;
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#01. Should be able to get profile - [GET]/me", function(done) {
    request
        .get("/me")
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
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
