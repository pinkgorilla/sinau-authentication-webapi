require("should");
var Request = require("supertest");
var Account = require("sinau-modules").test.data.auth.account;
var config = require("../config");
const host = `${config.ip}:${config.port}`;
var request = Request(host);

function getToken() {
    return new Promise((resolve, reject) => {
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
                            reject(err);
                        else {
                            var result = response.body;
                            // result.data.should.instanceOf(Array);
                            resolve(result.data);
                        }
                    });
            });
    });
}


module.exports = getToken;
