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
                    $('#new-question-form').val(" ");
                    let newQuestion = newQuestionDom(data.data.question);
                    $("#question-container").prepend(newQuestion);
                    deleteQuestion($(' .delete-question-button', newQuestion));
                }, error: function (err) {
                    console.log(`error is ${err}`, err.responseText);
                }
            });
        });

        
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
                    <div class = "delete-question-container">
                                <small>
                                    <a class="delete-question-button" href="/questions/delete/${question._id}">Delete</a>
                                </small>
                    </div>
                 </div>
            `);
    }


    //method to delete a question from DOM
    let deleteQuestion = function (deleteLink) { 
        $(deleteLink).click(function (e) { 
            e.preventDefault();

            console.log("delete link", deleteLink);
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) { 
                    console.log("data for delete", data);
                    $(`#question-${data.data.question_id}`).remove();
                },
                error: function (err) { 
                    console.log(`Error is ${err}`);
                }   
            });
        });
    }


    createQuestion();


}



