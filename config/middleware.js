var count = 0;
module.exports.setFlash = function (req, res, next) {
    console.log("reaching middleware", count++);
    res.locals.flash = {
        success: req.flash("success"),
        error: req.flash("error")
    };
    next();
};
