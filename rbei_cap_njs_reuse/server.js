"use strict";

var port = process.env.PORT || 3000;
var express = require("express");
var xsenv = require("@sap/xsenv");
var bodyParser = require('body-parser');
const HDBConn = require("@sap/hdbext");
const passport = require('passport');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const app = express();
const cors=require('cors');
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});


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


app.use(
	HDBConn.middleware(hanaOptions.hana)
);

app.use(bodyParser.json());
app.get('',(req,res)=>{
	res.send('Server is up and running');
})
app.use('/generic',require("./routes/search"));
app.use("/specific", require("./routes/specific_search"));
app.use('/user',require('./login/signup'));
app.use('/user/auth',require('./login/login'));
app.use("/bulk", require("./routes/bulk"));
app.use('/admin',require('./admin/userApprove'));

app.listen(port, function () {
	console.log('myapp is using Node.js version: ' + process.version); 
	console.log('myapp listening on port ' + port);
});
