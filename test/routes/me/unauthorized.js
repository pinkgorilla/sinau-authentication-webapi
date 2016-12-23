require("should");
const host = `${process.env.IP}:${process.env.PORT}`;
var Request = require("supertest");
var ObjectId = require("mongodb").ObjectId; 
var request = Request(host);

it("#01. get profile without security token - [GET]/me", function(done) {
    request
        .get("/me")
        .set("Accept", "application/json")
        .expect(401)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});
 