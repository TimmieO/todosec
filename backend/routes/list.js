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
  .route("/add")
  .get(async(req, res) => {
    logHelper("list.js", "Warning", "Add NOT supposed to be Get")

    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 1){
        logHelper("list.js", "Warning", "Access to Add with too low level")
      }

      let data = req.body.listData;

      var connectionObject = dbConnection();

      let insertListSql = 'insert into list(user_id, title, bg_color) values (?,?,?)';
      connectionObject.query(insertListSql,
        [decoded.user_id,data.title, data.color],
        function (err, result) {
          if (err) {
            logHelper("list.js", "Warning", err)
            console.log(err);
            return res.json({success: false})
          }
          else{
            return res.json({success: true})
          }
        })
      connectionObject.end();

    })
  })

router
  .route("/update")
  .get(async(req, res) => {
    logHelper("list.js", "Warning", "Update NOT supposed to be Get")

    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 1){
        logHelper("list.js", "Warning", "Access to Update with too low level")

        return res.status(401).send("Access denied");
      }
      let data = req.body.editData;

      var connectionObject = dbConnection();
      let action_sql = "UPDATE list SET title = ? WHERE id = ? AND user_id = ?"
      connectionObject.query(action_sql,
        [
          data.title,
          data.list_id,
          decoded.user_id
        ],
        async function (err, result) {
          if (err) {
            logHelper("list.js", "Warning", err)

            console.log(err)
          }
          else{
            res.json({result});
          }
        })

    })
  })

router
  .route("/delete")
  .get(async(req, res) => {
    logHelper("list.js", "Warning", "Delete NOT supposed to be Get")

    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 1){
        logHelper("list.js", "Warning", "Access to Delete with too low level")

        return res.status(401).send("Access denied");
      }
      let list_id = req.body.actionData;

      var connectionObject = dbConnection();
      let action_sql = "DELETE FROM list WHERE id = ? AND user_id = ?"
      connectionObject.query(action_sql,
        [
          list_id,
          decoded.user_id
        ],
        async function (err, result) {
          if (err) {
            logHelper("list.js", "Warning", err)

            console.log(err)
          }
          else{
            res.json({result});
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