var server = require('./server');
server().then((server) => {
    console.log("server ready");
});
