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
  .route("/delete")
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

      let data = req.body;

      var connectionObject = dbConnection();

      let removeTaskSql = 'DELETE FROM user WHERE user_id = ?';
      connectionObject.query(removeTaskSql,
        [data.id],
        function (err, result) {
          if (err) {
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
    throw "Error, not supposed to be GET request";
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(decoded.level != 5){
        return res.status(401).send("Access denied");
      }
      let user_id = decoded.user_id;

      var connectionObject = dbConnection();
      let action_sql = "SELECT user_id, firstname, lastname, username, email, access_level FROM user"
      connectionObject.query(action_sql, [user_id], async function (err, result) {
        if (err) {
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