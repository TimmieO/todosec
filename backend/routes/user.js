const express = require('express');
const mysql = require("mysql");
const bodyParser = require('body-parser');
let router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const cookieParser = require('cookie-parser')

const qrcode = require('qrcode');
const speakeasy = require('speakeasy')

const authenticationRoutes = require("./authentication");


require('dotenv').config({path: '../../.env'});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router
  .route("/register")
  .get((req, res) => {
  })
  .post(async function(req, res) {
    var connectionObject = dbConnection();

    //Data sent from user
    let data = req.body;

    //The sql for action
    let action_sql = 'insert into user(firstname, lastname, email, username, password, access_level, user_salt, auth_active) values (?,?,?,?,?,?,?,?)';
    let inset_token_sql = 'insert into auth(user_id, secret, otpauth_url) values (?,?,?)';

    let pwd_info = encryptPassword(data);

    let generatedSecret = speakeasy.generateSecret();
    connectionObject.query(action_sql,
      [data.firstname,
        data.lastname,
        data.email,
        data.username,
        pwd_info.pwd,
        1,
        pwd_info.user_salt,
        0
      ],
      function (err, result) {
        if (err) {
          console.log(err);
          res.json({message: 'Error', error: true})
        }
        if(!err){

          connectionObject.query(inset_token_sql,
            [result.insertId,
              generatedSecret.base32,
              generatedSecret.otpauth_url
            ],
            function (err, result) {
              if (err) {
                console.log(err);

                res.json({message: 'Error', error: true})
              }
              if(!err){
                res.json({message: 'Success', error: false})

              }
            }
          )
        }
        connectionObject.end();

      })
  })

router
  .route("/login")
  .get((req, res) => {
  })
  .post((req, res) => {
    var connectionObject = dbConnection();

    //Data sent from user
    let data = req.body;

    let get_salt_sql = "SELECT user_salt FROM user WHERE username = ?";
    let action_sql = "SELECT user_id, user.username, access_level, auth_active FROM user WHERE username = ? and password = ?";

    connectionObject.query(get_salt_sql, [data.username], function (err, result) {
      if (err) {
        console.log(err);
      }
      else{
        if(result.length > 0){ //If user_auth was found
          let user_salt = result[0].user_salt;
          let pwd = data.password;

          let hash_pwd = CryptoJS.SHA256(process.env.PUBLIC_SALT + user_salt + pwd).toString(CryptoJS.enc.Hex);
          connectionObject.query(action_sql, [data.username, hash_pwd], async function (err, result) {
            if (err) {
              console.log(err)
            }
            else {
              if(result.length > 0){//User exists
                const id = result[0].user_id;
                const username = result[0].username;
                const access_level = result[0].access_level
                const auth_active = result[0].auth_active
                let accessToken;

                if(auth_active == 1){ //If user has 2fa activated
                  accessToken = await jwt.sign({user: username, user_id: id, level: access_level, auth: false, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12)}, process.env.ACCESS_TOKEN_SECRET)
                }
                else{ //If no 2fa activated
                  accessToken = await jwt.sign({user: username, user_id: id, level: access_level, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12)}, process.env.ACCESS_TOKEN_SECRET)
                }

                res.cookie('logged_in', true, {httpOnly: true});
                res.cookie('SID', accessToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});

                return res.json({valid: true})

              }else{
                return res.json({valid: false, message: "Wrong info"});
              }
            }
          })
        }else{
          return res.send(result);
        }
      }
      connectionObject.end();
    })
  })

router
  .route("/countUsername")
  .get((req, res) => {
  })
  .post((req, res) => {
    var connectionObject = dbConnection();

    //Data sent from user
    let data = req.body;
    let action_sql = "SELECT COUNT(user_id) AS count FROM user WHERE username = ?";

    connectionObject.query(action_sql, [data.username], function (err, result) {
      if (err) {
        console.log(err);
      }
      else{
        let countTotal = result[0];
        return res.send(countTotal);
      }
    })
    connectionObject.end();

  })

router
  .route("/countEmail")
  .get((req, res) => {
  })
  .post((req, res) => {
    var connectionObject = dbConnection();

    //Data sent from user
    let data = req.body;
    let action_sql = "SELECT COUNT(user_id) AS count FROM user WHERE email = ?";

    connectionObject.query(action_sql, [data.email], function (err, result) {
      if (err) {
        console.log(err);
      }
      else{
        let countTotal = result[0];
        return res.send(countTotal);
      }
    })
    connectionObject.end();

  })

function encryptPassword(data){
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 64;
  var salt_str = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    salt_str += chars.substring(rnum,rnum+1);
  }
  var hash_pwd = CryptoJS.SHA256(process.env.PUBLIC_SALT + salt_str + data.password).toString(CryptoJS.enc.Hex);
  return {pwd: hash_pwd, user_salt: salt_str}
}

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