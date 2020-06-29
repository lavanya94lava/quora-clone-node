const Question = require("../models/question");


//controller for creating the question using Mongoose ORM
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
        req.flash("error", "Error in Posting a question");
        return res.redirect("back");
    }
}

//controller for creating the question using Mongoose ORM

module.exports.deleteQuestion = async function (req, res) { 
    try {
        let question = await Question.findById(req.params.id);
        
        question.delete();
        if(req.xhr){
            return res.status(200).json({
                data:{
                    question_id:req.params.id
                },
                message:"Post deleted"
            });
        }
        
        req.flash("success", "Question Deleted Successfully");
        return res.redirect("back");
    }

    catch (e) { 
        console.log(`Error is ${e}`);
        return res.redirect("back");
    }
}