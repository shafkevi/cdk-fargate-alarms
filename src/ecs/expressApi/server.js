'use strict';

const express = require('express');
const mysql = require('mysql');
let con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
})

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('NODE How to bring a containerized web app online in 12 minutes (from start to finish)');
});

app.get('/db', (req, res) => {
  con.connect(function(err){
    con.query("SELECT NOW()", function(err, result, fields) {
      if (err) res.send(err);
      if (result) res.send({result});
      if (fields) console.log(fields);
    });
  })
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
