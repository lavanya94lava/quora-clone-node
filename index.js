const express = require('express');

const app = express();

const port = 8000;
const db = require('./config/mongoose');

const expressLayouts = require('express-ejs-layouts');


app.use(express.urlencoded());

app.use(expressLayouts);

app.listen(port, function (err) { 
    if (err) { 
        console.log(`error in running the server on port ${port}`);
    }
    console.log(`server is running on port ${port}`);
});