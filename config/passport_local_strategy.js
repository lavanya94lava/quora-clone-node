//this file contains the local strategy for authentication using passport

const passport = require('passport');

const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

const bcrypt = require("bcrypt");
passport.use(new localStrategy({
    usernamefield: 'email'
}, function (email, password, done) { 
        User.findOne({ email: email }, function (err, user) { 
            if (err) { 
                req.flash('error', err);
                return done(err);
            }
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    req.flash('error', err);
                    return done(err);
                }
                if (isMatch) {
                    if (user.isVerified) {
                        return done(null, user);
                    }
                    else {
                        req.flash("error", "User is not verified, Please check your email and confirm");
                        return done(null, false);
                    }
                }
                req.flash("error", "Invalid Password or couldn't decipher it");
                return done(null,false);
            });
        });
}));


passport.serializeUser(function (user, done) { 
    done(null,user.id);
});


passport.deserializeUser(function (id, done) { 
    User.findById(id, function (err, user) {
        if (err) { 
            return done(err);
        }
        return done(null,user);
     });
});


passport.checkAuthentication = function (req, res, next) { 
    if (req.isAuthenticated()) { 
        return next();
    }

    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) { 
    if (req.isAuthenticated) { 
        req.locals.user = req.user;
    }
    next();
}

module.exports = passport;