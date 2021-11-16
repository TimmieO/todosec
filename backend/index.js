const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 4000;
const host = "localhost";


require('dotenv').config({path: '../.env'});

const userRoutes = require("./routes/user");
const authenticationRoutes = require("./routes/authentication");
const fetchData = require("./routes/fetchData");
const twoFA = require("./routes/2fa");
const adminAction = require("./routes/admin");
const listAction = require("./routes/list");
const taskAction = require("./routes/task");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

app.use("/api/user", userRoutes, authenticationRoutes);
app.use("/api/auth", authenticationRoutes);
app.use("/api/fetchData", fetchData);
app.use("/api/2fa", twoFA);
app.use("/api/admin", adminAction);
app.use("/api/list", listAction);
app.use("/api/task", taskAction);

app.use(express.static(__dirname + '/public'));

app.listen(port, host, function () {
  console.log("Running at http://" + host + ":" + port);
});