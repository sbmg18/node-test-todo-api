var {SHA256} = require("crypto-js");
var jwt = require("jsonwebtoken");

var data = {
    id: 1
}

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "secretAccessKey").toString()
// }

// data.id = 2;
// token.hash = SHA256(JSON.stringify(data)).toString();

// var verifyHash = SHA256(JSON.stringify(token.data) + "secretAccessKey").toString();

// if(token.hash === verifyHash) {
//     console.log("Token matched: Data was not modified.");
// } else {
//     console.log("Data was changed.");
// }



var token = jwt.sign(data, "secretAccessKey");

var decoded = jwt.verify(token, "secretAccessKey");

console.log(decoded);