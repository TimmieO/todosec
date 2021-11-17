const express = require('express');
const bodyParser = require('body-parser');
let router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const mysql = require("mysql");

const speakeasy = require('speakeasy')

require('dotenv').config({path: '../../.env'});

const logHelper = require('../functions/logHelper');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router
  .route("/validate")
  .get(async(req, res) => {
    logHelper("2fa.js", "Warning", "Validate NOT supposed to be Get")
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){

      let data = req.body;
      let user_id = decoded.user_id;

      var connectionObject = dbConnection();
      let action_sql = "SELECT secret FROM auth WHERE user_id = ?"
      connectionObject.query(action_sql, [user_id], async function (err, result) {
        if (err) {
          logHelper("2fa.js", "Warning", err)
          console.log(err)
        }
        else {
          if(result.length > 0){//User exists
            const secret = result[0].secret;
            let token = data.enteredAuthToken;

            try {

              const verified = speakeasy.totp.verify({
                secret,
                encoding: 'base32',
                token
              });
              if (verified) {
                let accessToken = await jwt.sign({user: decoded.user, user_id: decoded.user_id, level: decoded.level, auth: true, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12)}, process.env.ACCESS_TOKEN_SECRET)
                res.cookie('SID', accessToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
                res.json({verified: true});
              }
              if (!verified) {
                res.json({verified: false})
              }
            }
            catch (error){
              logHelper("2fa.js", "Warning", error)
            }

          }else{
            return res.json({valid: false});
          }
        }
      })

    })
  })

router
  .route("/activate")
  .get(async(req, res) => {
    throw "Error, not supposed to be GET request";
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      var connectionObject = dbConnection();

      let user_id = decoded.user_id;

      let action_sql = "UPDATE user SET auth_active = 1 WHERE user_id = ?";
      connectionObject.query(action_sql, [user_id], async function (err, result) {
        if (err) {
          console.log(err);
        }
        else{
          let accessToken = await jwt.sign({user: decoded.user, user_id: decoded.user_id, level: decoded.level, auth: true, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12)}, process.env.ACCESS_TOKEN_SECRET)
          res.cookie('SID', accessToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
          return res.json({verified: true});
        }
      })
      connectionObject.end();
    })
  })

//Conn to db
function dbConnection() {
  var con =
    mysql.createConnection({
      host: process.env.DB_ADMIN_HOST,
      user: process.env.DB_ADMIN_USER,
      password: process.env.DB_ADMIN_PASSWORD,
      database: process.env.DB_ADMIN_DATABASE

    })
  con.connect(function (err) {
    if (err) throw err;
  })
  return con;
}

module.exports = router;