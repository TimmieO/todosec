const express = require('express');
const bodyParser = require('body-parser');
let router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const mysql = require("mysql");

const qrcode = require('qrcode');

const logHelper = require('../functions/logHelper');

const loadIniFile = require('read-ini-file');
const path = require('path')

const accessFile = path.join(__dirname, '../access.ini')

require('dotenv').config({path: '../../.env'});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router
  .route("/auth")
  .get(async(req, res) => {
    logHelper("fetchData.js", "Warning", "Auth NOT supposed to be Get")
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){

      let user_id = decoded.user_id;

      var connectionObject = dbConnection();
      let action_sql = "SELECT user.user_id, auth.otpauth_url, user.auth_active FROM user JOIN auth ON auth.user_id = user.user_id WHERE user.user_id = ?"
      connectionObject.query(action_sql, [user_id], async function (err, result) {
        if (err) {
          logHelper("fetchData.js", "Warning", err)
          console.log(err)
        }
        else {
          if(result.length > 0){//User exists
            const auth_active = result[0].auth_active
            const otpauth_url = result[0].otpauth_url

            if(auth_active == 0){
              qrcode.toDataURL(otpauth_url, function(err, data){

                res.json({auth_active: false, qrCode: data});

              })
            }
            else{
              res.json({auth_active: true})
            }
          }else{
            return res.json({valid: false});
          }
        }
      })

    })
  })

router
  .route("/admin")
  .get(async(req, res) => {
    logHelper("fetchData.js", "Warning", "Admin NOT supposed to be GET")
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 5){
        logHelper("fetchData.js", "Warning", "Able to access ADMIN while too low of level")
        return res.status(401).send("Access denied");
      }
      let user_id = decoded.user_id;

      var connectionObject = dbConnection();
      let action_sql = "SELECT user_id, firstname, lastname, username, email, access_level FROM user"
      connectionObject.query(action_sql, [user_id], async function (err, result) {
        if (err) {
          logHelper("SQL failed to get list", "Warning", err)
          console.log(err)
        }
        else {
          if(result.length > 0){//User exists
            const user_id = result[0].user_id
            const firstname = result[0].firstname
            const lastname = result[0].lastname
            const username = result[0].username
            const email = result[0].email
            const access_level = result[0].access_level
            res.json({info: result})
          }else{
            return res.json({valid: false});
          }
        }
      })

    })
  })

router
  .route("/list")
  .get(async(req, res) => {
    logHelper("fetchData.js", "Warning", "List NOT supposed to be GET")
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;

    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 1){
        logHelper("fetchData.js", "Warning", "Able to access LIST while too low of level")
        return res.status(401).send("Access denied");
      }
      let user_id = decoded.user_id;
      let retObj = {list: null, task: null};
      var connectionObject = dbConnection();
      let action_sql = "SELECT id, title, bg_color FROM list WHERE user_id = ?"
      connectionObject.query(action_sql, [user_id], async function (err, result) {
        if (err) {
          logHelper("fetchData.js", "Warning", err)
          console.log(err)
        }
        else {
          retObj.list = result;
          let action_sql = "SELECT id, list_id, title, done FROM task WHERE user_id = ?"
          connectionObject.query(action_sql, [user_id], async function (err, result) {
            if (err) {
              logHelper("fetchData.js", "Warning", err)
              console.log(err)
            }
            else {
              retObj.task = result;
              res.json({retObj})
            }
          })
        }
        connectionObject.end();

      })

    })
  })


//Conn to db
function dbConnection()
{
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