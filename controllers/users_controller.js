const User = require('../models/user');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const nodemailer = require("../config/nodemailer");

module.exports.signUp = function (req, res) {
    return res.render('sign_up', {
        recaptcha: res.recaptcha,
        title:"Sign Up"
    });
}

//sign in form
module.exports.signIn = function(req,res){
    return res.render('sign_in', {
        recaptcha: res.recaptcha,
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

        console.log("hashed password", hashedPassword);
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
                    to: user.email,
                    subject: "Account Verification for Curiosity App",
                    text:'Click on the link to verify your account \n\n' + 'http://'+ req.headers.host + '/users/verify-user/' + token + '\n\n'
                }, function (err, info) {
                        console.log("info",info);
                        if (err) { 
                            req.flash("error", "Error in sending the email");
                            return;
                        }
                        req.flash("success", "message sent successfully");
                        return res.redirect("back");
                });
            req.flash("success", "new user created successfully, please click on the link sent to your email to verify yourself");
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
        req.flash("error", "Error caught");
        res.redirect('back');
    }
}


//create-session after signing in
module.exports.createSession = function (req,res) { 
    req.flash("success", "You have loggedIn successfully");
    return res.redirect("/");
}

//sign-out functionality
module.exports.destroySession = function (req, res) {
    req.flash("success", "You have logged out successfully");
    req.logout();

    return res.redirect("/");
}

//forgot password form views 
module.exports.forgotPassword = function (req, res) { 
    return res.render("forgot_password", {
        title: "Forgot Password"
    });
}


//forgot password post action

module.exports.forgotPasswordAction = async function (req, res) {
    try {
        const token = crypto.randomBytes(20).toString("hex");

        await User.findOne({ email: req.body.email }, function (err,user) { 
            if (!user) { 
                req.flash("error", "No such user exists, please check");
                return res.redirect("/users/forgot-password");
            }
            user.passwordToken = token;
            user.tokenExpiry = Date.now() + 1800000;
            user.save();

            nodemailer.sendMail({
                to: user.email,
                subject: "Password Reset Mail For Curiosity ",
                text:'Click on the link below to reset your password :\n\n' + 'http://'+ req.headers.host + '/users/reset-password/'+token + '\n\n' 
            }, function (err, info) {
                    if (err) { 
                        req.flash("success", "Error in sending Email");
                        return;
                    }
                    req.flash("success", "message sent successfully");
                    return res.redirect("back");
            });
        });
    }
    catch (err) { 
        req.flash("error", "check the function again");
        return res.redirect("/users/forgot-password");
    }
}

//reset form view
module.exports.resetPasswordForm = function (req, res) { 
    return res.render("password_reset", {
        title: "Reset Password",
        token:req.params.token
    });
}

//reset password post action
module.exports.resetPasswordAction = async function (req,res) { 
    try {
        await User.findOne({ passwordToken: req.params.token, tokenExpiry: { $gt: Date.now() } }, function (err, user) { 
            if (!user) { 
                req.flash("error", "Token has expired or it is not valid");
                return res.redirect("back");
            }
            if (req.body.password == req.body.confirm_password) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (err) {
                            req.flash("error", "error in creating hash");
                            return res.redirect("back");
                        }
                        user.password = hash;
                        user.save();
                    });
                });
                req.flash("success", "Passwords Changed Successfully");
                return res.redirect('/');
            }
            else { 
                req.flash("error", "Password did not match");
                return res.redirect("back");
            }
        });
    }
    catch (err) {     
        req.flash("error","some error");
        return res.redirect("back");
    }
}


//reset password after sign in 

module.exports.resetPasswordAfterSignIn = async function (req, res) {
    try {
        await User.findOne({ email: req.user.email }, function (err,user) {
            if (!user) { 
                req.flash("error", "Please check your email again");
                return res.redirect("back");
            }
            if (req.body.password ===req.body.confirm_password) { 
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (err) {
                            req.flash("error", "error in creating the hash");
                            return res.redirect("back");
                        }
                        user.password = hash;
                        user.save();
                    });
                });
                req.flash("success", "Password changed successfully");
                return res.redirect("/users/sign-in");
            }
            else {
                req.flash("error", "Password changed successfully");
                return res.redirect("back");
            }
        });
    }
    catch (e) { 
        req.flash("error", "some error");
        return res.redirect("back");
    }
}





