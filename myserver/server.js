const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'static')));

// Define routes for handling HTTP requests
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index2', function (req, res) {
  res.sendFile(path.join(__dirname, 'index2.html'));
});

app.get("/geojson", function (req, res) {
  console.log("Sending geojson")
  res.sendFile(path.join(__dirname, "countries.geojson"));
});

app.get("/swiss_all", function (req, res) {
  console.log("Sending swiss_all")
  res.sendFile(path.join(__dirname, "swiss_all.csv"));
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});


