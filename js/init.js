(function($){
    $(function(){
        var correctAnswersCounter = 0;
        var totalQuestionsCounter = 0;
        var resp;
        var correctAnswer;
        var unselectedLetters;

        $(window).on( "load", function() {
            $("#skip-btn").trigger("click");
        });

        $("#skip-btn").on("click", function(event) {
            requestRandom();
            return false;
        });

        $("#submit-btn").on("click", function(event) {
            requestRandom();
            switchButtons("#submit-btn", "#skip-btn");
            return false;
        });

        $("#letter-tags").on("click", " a", function(event) {
            event.stopPropagation();
            event.preventDefault();
            $(this).off();

            $("#answer-input-block").append(this);
            unselectedLetters--;

            if(unselectedLetters === 0) {
                checkAnswer();
            }

        });

        $("#answer-input-block").on("click", " a", function(event) {
            event.stopPropagation();
            event.preventDefault();
            $(this).off();

            unselectedLetters++;
            $("#letter-tags").append(this);

        });

        function requestRandom() {
            $.ajax({
                'url': "https://jservice.io/api/random",
                'dataType': 'json',
                'data' : {'count' : 1}

            }).done(function(data) {
                resp = data[0];
                $("#letter-tags").html("");
                $("#answer-input-block").html("");

                updateTotalQuestions();

                $("#question-number span").text(resp['id']);
                $("#category span").text(resp['category']['title']);
                $("#description p").text(resp['question']);

                showRandomizedAnswer(resp['answer']);
            });
        }

        function updateTotalQuestions() {
            totalQuestionsCounter++;
            $("#total-questions span").text(totalQuestionsCounter);
        }

        function updateCorrectAnswers() {
            correctAnswersCounter++;
            $("#correct-answers span").text(correctAnswersCounter);
        }

        function showRandomizedAnswer(answer) {
            correctAnswer = answer;
            var shuffled = answer.toUpperCase().split('').sort(function(){return Math.random()});
            var len = shuffled.length;
            unselectedLetters = len;

            for (var i = 0; i < len; i ++) {
                if (shuffled[i] == " ") {
                    shuffled[i] += "&nbsp;";
                }
                $("#letter-tags").append('<a href="#" class="chip">' + shuffled[i] + '</a>');
            }
        }

        function checkAnswer() {
            var res = $("#answer-input-block a").text();

            if (res == correctAnswer.toUpperCase() ) {
                updateCorrectAnswers();
                switchButtons("#skip-btn", "#submit-btn");
            } else {
                alert("Try Again!");
            }
        }

        function switchButtons(from, to) {
            $(from).addClass("hide");
            $(to).removeClass("hide");
        }

    });

    // end of document ready
})(jQuery); // end of jQuery name space
