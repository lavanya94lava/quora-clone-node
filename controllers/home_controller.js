const expressLayouts = require("express-ejs-layouts");


module.exports.home = async function (req,res) { 
    try {
        return res.render('home', {
            title: "Quora"
        });
    }

    catch(err){ 
        console.log(`Error is `, err);
        return;
    }
}