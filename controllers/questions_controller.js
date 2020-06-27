const Question = require("../models/question");

module.exports.createQuestion = async function (req, res) { 
    try {
        let question = Question.create({
            user: req.user,
            content:req.body.question
        });

        res.redirect("back");
    }
    catch (e) { 
        console.log(`Error is ${e}`);
        req.flash("error","Error in Posting a question");
    }
}