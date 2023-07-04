const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 4000;
const path = require("path");
const nodemailer = require('nodemailer');
const cors = require('cors');
const  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use("/public",express.static(path.join(__dirname,"public")));

server.listen(PORT,()=>{ console.log(`server started on ${PORT}`) })

app.use(cors());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get('/', function (req, res) {
  res.render("main.ejs");
});