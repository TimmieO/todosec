const logHelper = require('../functions/logHelper');

const loadIniFile = require('read-ini-file');
const path = require('path')

const settingsFile = path.join(__dirname, '../settings.ini')
const settingsIni = loadIniFile.sync(settingsFile)

const userObj = [];
const actionCounter =
  {
    userActions : function(data) {
      for(let i = 0; i < userObj.length; i++){
        let time = Date.now() - userObj[i].exp;

        if(time > settingsIni.ActionLimit.expTime){
          userObj.splice(i, 1);
        }

        if(userObj[i].ip == data.ip){
          if(data.action == 'login'){
            let amount = userObj[i][data.action];
            if(amount > Number(settingsIni.ActionLimit.loginMax)){
              if(amount == Number(settingsIni.ActionLimit.loginMax)){
                logHelper("UserAction", "WARNING", "Too many login attempts by " + data.ip);
              }
              return false
            }
          }

          userObj[i][data.action] += 1;
          return
        }
      }

      this.addUser(data)
    },
    addUser: function (data) {
      let addUser = {ip: data.ip, login: 0, exp: Date.now()};
      userObj.push(addUser);
      return
    }
  }

module.exports = actionCounter;