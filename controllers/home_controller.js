const Question = require("../models/question");


module.exports.home = async function (req,res) { 
    try
    {
        let allQuestions = await Question.find({}).populate('user').exec();

        return res.render('home', {
            title: "Quora",
            allQuestions:allQuestions
        });
    }

    catch(err){ 
        console.log(`Error is `, err);
        return;
    }
}