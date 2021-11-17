const express = require('express');
const bodyParser = require('body-parser');
let router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const cookieParser = require('cookie-parser')

const qrcode = require('qrcode');

const speakeasy = require('speakeasy')


const loadIniFile = require('read-ini-file');
const path = require('path')

const accessFile = path.join(__dirname, '../access.ini')
const accessIni = loadIniFile.sync(accessFile)

require('dotenv').config({path: '../../.env'});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router
  .route("/access")
  .get(async(req, res) => {
    throw "Error, not supposed to be GET request";
    return res.status(404);
  })
  .post(async (req, res) => {
    const cookies = req.cookies;
    let path = req.body.path;
    let data = path.substring(1);

    //replace / with home
    if(path == "/"){
      data = "home";
    }

    //If user has no session ID
    if(!cookies.SID){
      let accessToken = await jwt.sign({user: 'guest', level: 0, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.ACCESS_TOKEN_SECRET)
      res.cookie('SID', accessToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
      res.cookie('logged_in', false, {httpOnly: true});
      if(Number(accessIni.Access[data]) <= 0){
        return res.json({access: true, path: path})
      }
      else if(Number(accessIni.Access[data]) > 0){
        return res.json({access: false, path: path})
      }
      else{
        return res.json({error: true})
      }
    }

    jwt.verify(cookies.SID, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded){
      if(err){
        if(err.name == 'TokenExpiredError'){
          res.clearCookie("SID");
          res.clearCookie("logged_in");
        }
        return res.status(404).json({access: false, path: path});
      }

      if(decoded.level > 0 && !cookies.logged_in){
        res.cookie('logged_in', true, {httpOnly: true});
      }

      //no access to login or register when logged in
      if(decoded.level > 0 && Number(accessIni.Access[data]) < 0){
        return res.json({access:false, path: path});
      }

      if(decoded.level >= Number(accessIni.Access[data])){ //Access

        if(decoded.auth != undefined && decoded.auth == false){ //Make sure auth is active
          if(path == '/auth'){ //if path is auth return access true
            return res.json({access: true, path: path, auth: false})
          }
          return res.json({access: false, path: path, auth: false})
        }
        if(path == '/auth'){
          if(decoded.auth == undefined || decoded.auth == true){ //If user has not activated auth or auth is already done
            return res.json({access: false, path: path})
          }
        }

        return res.json({access: true, path: path})
      }
      else if(decoded.level <= Number(accessIni.Access[data])){ //Access level too low
        return res.json({access: false, path: path})
      }
      else{
        return res.json({error: true});
      }
    });

  })

module.exports = router;