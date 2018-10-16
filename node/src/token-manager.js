var fs = require('fs')
var jwt = require('jsonwebtoken')
const path = require("path")
const JWT_PASSPHRASE = process.env.JWT_PASSPHRASE ? process.env.JWT_PASSPHRASE: 'cevativo'

function generateToken(userId, isAdmin=false, expiresIn=315360000) { // expires in 10 years
  var key = fs.readFileSync(path.resolve(__dirname, './private.pem'));
  const payload = { userId, isAdmin }
  const token = jwt.sign(payload, {
    key: key,
    passphrase: JWT_PASSPHRASE
  }, {
    expiresIn,
    algorithm: 'RS256'
  });
  return token;
}

exports.getStudentToken = function (studentId) {
  return generateToken(`${studentId}`);
}

exports.getAdminToken = function (containerName='admin', expiresIn=10000) {
  return generateToken(containerName, true, expiresIn)
}

