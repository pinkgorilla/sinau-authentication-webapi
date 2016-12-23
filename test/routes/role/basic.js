 var basicTest = require("../basic-test-factory");
 basicTest({
     uri: "/roles",
     model: require("sinau-models").auth.Role,
     validate: require("sinau-models").validator.auth.role,
     util: require("sinau-modules").test.data.auth.role,
     keyword: "code"
 });
 