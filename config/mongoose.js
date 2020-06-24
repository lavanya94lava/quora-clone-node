//this file contains the configuration  of Mongo Connection mongoose

const mongoose = require("mongoose");

//make your db
mongoose.connect(`mongodb://localhost/quoraClone_db`);

//connect it

const db = mongoose.connection;

db.on("error", console.log.bind(console, "Error in Connecting to the DB"));

//verify it

db.once("open", function () {
  console.log("connected to the DB Quora Clone");
});

module.exports = db;
