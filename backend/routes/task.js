const express = require('express');
const bodyParser = require('body-parser');
let router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const mysql = require("mysql");


require('dotenv').config({path: '../../.env'});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router
  .route("/add")
  .get(async(req, res) => {
    throw "Error, not supposed to be GET request";
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 5){
        console.log("hey")
      }

      let data = req.body.listData;
      console.log(data);

      var connectionObject = dbConnection();

      let insertTask = 'insert into task(list_id, user_id, title, done) values (?,?,?,?)';
      connectionObject.query(insertTask,
        [data.list_id, decoded.user_id, data.title, 0],
        function (err, result) {
          if (err) {
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
    throw "Error, not supposed to be GET request";
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 1){
        return res.status(401).send("Access denied");
      }
      let data = req.body.editData;


      console.log(data);

      var connectionObject = dbConnection();
      let action_sql = "UPDATE task SET title = ? WHERE id = ?"
      connectionObject.query(action_sql,
        [
          data.title,
          data.task_id,
        ],
        async function (err, result) {
          if (err) {
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
    throw "Error, not supposed to be GET request";
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level < 1){
        return res.status(401).send("Access denied");
      }
      let list_id = req.body.actionData;

      var connectionObject = dbConnection();
      let action_sql = "DELETE FROM task WHERE id = ?"
      connectionObject.query(action_sql,
        [
          list_id
        ],
        async function (err, result) {
          if (err) {
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