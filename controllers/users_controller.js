const User = require('../models/user');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const nodemailer = require("../config/nodemailer");

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

//sign up data and send mail to confirm and verify the user
module.exports.createUser = async function (req,res) { 
    try {
        if (req.body.password != req.body.confirm_password) {
            req.flash("error", "Please check your passwords again");
            return res.redirect("back");
        }
        if (req.recaptcha.error) {
            req.flash("error", "Recaptch Error");
            return res.redirect("back");
        }
        let token = crypto.randomBytes(20).toString("hex");

        await User.findOne({
            email:req.body.email
        }, function (err, user) { 
            if (err) {
                console.log("error in signing up the user");
                return res.redirect("back");
            }
            if (user) { 
                req.flash("error", "username already exists, choose  a different email");
                return res.redirect("back");
            }
        });

        const hashedPassword = await new Promise((res, rej) => { 
            bcrypt.genSalt(10, function (err, salt) { 
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    if (err) {
                        req.flash("error", "error in generating hash");
                        rej(hash);
                        return res.redirect("/sign-up");
                    }
                    res(hash);
                });
            });
        });

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            isVerified: false,
            passwordToken: token,
            tokenExpiry: Date.now()+1800000
        }, function (err, user) { 
            if (err) { 
                console.log("error in creating the user");
                return res.redirect("back");
            }
                nodemailer.sendMail({
                    to: req.body.email,
                    subject: "Account Verification for Curiosity App",
                    text:'Click on the link to verify your account \n\n' + 'http://'+ req.headers.host + '/users/verify-user' + token + '\n\n'
                }, function (err, info) {
                        if (err) { 
                            req.flash("error", "Error in sending the email");
                            return;
                        }
                        req.flash("success", "message sent successfully");
                        return res.redirect("back");
                });
            req.flash("success", "new user created successfully, please click on the link send to your email to verify yourself");
        });
    }
    catch (err) { 
        req.flash("error",`${err} some error`);
        return res.redirect("back");
    }
}


// controller to verify the user after signing-up
module.exports.verifyUser = async function (req, res) { 
    try {
        await User.findOne({ passwordToken: req.params.token, tokenExpiry: { $gt: Date.now() } }, function (err, user) { 
            if (!user) { 
                req.flash("error", "Token has expired or is not valid");
                return res.redirect("back");
            }
            user.isVerified = true;
            user.save();
            req.flash("success", "congratulations, You are verified");
            return res.redirect("/users/sign-in");
        });
    }
    catch (err) { 
        req.flash("success", "You have loggedIn successfully");
        res.redirect('back');
    }
}
