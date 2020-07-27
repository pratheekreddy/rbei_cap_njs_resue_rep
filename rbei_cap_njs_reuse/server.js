"use strict";

var port = process.env.PORT || 3000;
var express = require("express");
var xsenv = require("@sap/xsenv");
var bodyParser = require('body-parser');
const HDBConn = require("@sap/hdbext");
const passport = require('passport');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

// var gxssrv = xsenv.getServices({
// 	uaa: {
// 		tag: 'xsuaa'
// 	},
// 	destination: {
// 		tag: 'destination'
// 	}
// });

// passport.use(new JWTStrategy(gxssrv.uaa));

// app.use(passport.initialize());
// app.use(passport.authenticate('JWT', {
// 	session: false
// }));

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

const app = express();
app.use(
	HDBConn.middleware(hanaOptions.hana)
);

app.use(bodyParser.json());

app.use('/generic',require("./routes/search"));
app.use("/specific", require("./routes/specific_search"));

app.use("/bulk", require("./routes/bulk"));

app.listen(port, function () {
	console.log('myapp is using Node.js version: ' + process.version); 
	console.log('myapp listening on port ' + port);
});
