var connect = require('connect');

// connect.createServer(
// 	connect.static("../angularjs")
// ).listen(5000); 
// it a old implementation, check below

serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic("angularjs"));
app.listen(5000);
