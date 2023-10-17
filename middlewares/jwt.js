require('dotenv').config();
const { expressjwt: jwt } = require("express-jwt");
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
   secret: jwks.expressJwtSecret({
      cache: true,
      jwksUri: `https://login.microsoftonline.com/${process.env.TENANT_ID}/discovery/v2.0/keys`
   }),
   algorithms: ['RS256']
})

module.exports = jwtCheck;