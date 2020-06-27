const express = require('express');
const router = express.Router();
const passport = require('passport');

const homeController = require('../controllers/home_controller');
const usersController = require('../controllers/users_controller');
const Recaptcha = require('express-recaptcha').RecaptchaV2

const SITE_KEY = "6Lfq8KkZAAAAANp08aKXzmCrlsHJ_5GJY-Qz6AuG";
const SECRET_KEY = "6Lfq8KkZAAAAAKhY64TA4tijDsMNmJAjvRj_HU10";

const recaptcha =  new Recaptcha(SITE_KEY, SECRET_KEY, {callback:'cb'});

//route to sign up a user
router.get('/sign-up',recaptcha.middleware.render,usersController.signUp);

//route to create a user
router.post('/create',recaptcha.middleware.verify, usersController.createUser);

//route to verify the user
router.get('/verify-user/:token',usersController.verifyUser);

//route to sign in a user
router.get('/sign-in',recaptcha.middleware.render,usersController.signIn);

//route to create a session
router.post('/create-session',recaptcha.middleware.verify,passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
), usersController.createSession);

//logout a user
router.get('/sign-out',usersController.destroySession);

//reset password of a signedin user
router.get('/reset-password/:token',usersController.resetPasswordForm);

//post data about resetForm and send mail
router.post('/reset-password-action/:token',usersController.resetPasswordAction);

//forgot password form
router.get('/forgot-password', usersController.forgotPassword);

//post data about forgot password and send mail
router.post('/forgot-password-action',usersController.forgotPasswordAction);

//reset password after signing-in
router.get('/reset-password-signed-in',usersController.resetPasswordForm);

//post the reset password data after sign in
router.post('/reset-password-signed-in',usersController.resetPasswordAfterSignIn);
//get google Oauth route
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

//get the route where google auth data would be received
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

module.exports = router;