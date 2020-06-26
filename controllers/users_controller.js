const User = require('../models/user');

module.exports.signUp = function (req, res) {
    return res.render('sign_up',{
        title:"Sign Up"
    });
}

//sign in form
module.exports.signIn = function(req,res){
    return res.render('sign_in',{
        title:"Sign In"
    });
}
