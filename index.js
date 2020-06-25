const express = require('express');

const app = express();

const port = 8000;
const db = require('./config/mongoose');
const passport = require("passport");

const passportLocal = require("./config/passport_local_strategy");

const session = require("express-session");

const expressLayouts = require('express-ejs-layouts');

const flash = require("connect-flash");


app.use(express.urlencoded());

app.use(expressLayouts);

app.listen(port, function (err) { 
    if (err) { 
        console.log(`error in running the server on port ${port}`);
    }
    console.log(`server is running on port ${port}`);
});