const Question = require("../models/question");

module.exports.createQuestion = async function (req, res) { 
    try {
        let question = await Question.create({
            user: req.user,
            content:req.body.question
        });

        if (req.xhr) { 
            return res.status(200).json({
                data: {
                    question:question
                },
                message:"Post Created"
            });
        }

        req.flash("success", "Question Created Successfully");
        res.redirect("back");
    }
    catch (e) { 
        console.log(`Error is ${e}`);
        req.flash("error","Error in Posting a question");
    }
}