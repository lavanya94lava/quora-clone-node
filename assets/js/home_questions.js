{

    const createQuestion = function () {
        let newQuestionForm = $('#new-question-form');

        
        
        newQuestionForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/questions/create',
                data: newQuestionForm.serialize(),
                success: function (data) {
                    console.log("data", data.data.question);
                    let newQuestion = newQuestionDom(data.data.question);
                    $("#question-container").prepend(newQuestion);
                }, error: function (err) {
                    console.log(`error is ${err}`, err.responseText);
                }
            });
        });

        newQuestionForm.val('');
    }

    //method to create a question in DOM
    let newQuestionDom = function (question) {
        return $(`<div id = "question-${question._id}" class = "question-card">
                <div>
                    <strong>${question.content}</strong>
                </div>
                <div class= "question-asker">
                    <p>Asked by ${question.user.name}</p>
                </div>
            </div>    `);
    }
    createQuestion();
}

