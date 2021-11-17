const fs = require('fs')

async function sendLog(info, type, err){

  var date = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();

  let message = "\n" + date + " " + time + " " + info + " " + type + ": " + err;


  fs.appendFile('./log/log.txt', message, 'utf8', (err) => {
    if (err) return console.log(err);
    console.log(message);
  });
}

module.exports = sendLog;