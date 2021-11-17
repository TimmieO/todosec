const express = require('express');
const bodyParser = require('body-parser');
let router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const mysql = require("mysql");

const logHelper = require('../functions/logHelper');

require('dotenv').config({path: '../../.env'});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router
  .route("/delete")
  .get(async(req, res) => {
    logHelper("admin.js", "Warning", "Delete NOT supposed to be GET")
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 5){
        logHelper("admin.js", "Warning", "Access to DELETE with too low of a level")
      }

      let data = req.body;

      var connectionObject = dbConnection();

      let removeTaskSql = 'DELETE FROM user WHERE user_id = ?';
      connectionObject.query(removeTaskSql,
        [data.id],
        function (err, result) {
          if (err) {
            logHelper("admin.js", "Warning", err)
            console.log(err);
          }
          else{
            return res.json(result)
          }
        })
      connectionObject.end();

    })
  })

router
  .route("/update")
  .get(async(req, res) => {
    logHelper("admin.js", "Warning", "Update NOT supposed to be GET")
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 5){
        logHelper("admin.js", "Warning", "Access to UPDATE with too low of a level")
        return res.status(401).send("Access denied");
      }
      let data = req.body.val;

      var connectionObject = dbConnection();
      let action_sql = "UPDATE user SET username = ?, firstname=?, lastname=?, email=?, access_level=? WHERE user_id = ?"
      connectionObject.query(action_sql,
        [
          data.username,
          data.firstname,
          data.lastname,
          data.email,
          data.access_level,
          data.user_id
        ],
        async function (err, result) {
        if (err) {
          logHelper("admin.js", "Warning", err)
          console.log(err)
        }
        else{
        }
      })

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