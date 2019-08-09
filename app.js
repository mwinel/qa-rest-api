"use-strict";

// Create an express app.

var express = require("express");
var app = express();
var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

// Create database connection
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");

var db = mongoose.connection;

db.on("error", function(err) {
  console.log("connection error", err);
});
db.once("open", function() {
  console.log("db connection successful");
});

// Enable CORS
app.use(function(res, req, next) {
  res.header("Allow-Control-Allow-Origin", "*");
  res.header("Allow-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // Grant pre-flight request's permission
  if (req.method === "OPTIONS") {
    res.header("Allow-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
})

// Add routes
app.use("/questions", routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on port", port);
});
