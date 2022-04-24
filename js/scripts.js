
var questions               = [];
var answers                 = [];
var correctAnswers          = [];

function animationPipeline() {

    // Variables
    var questionTime        = 20; // Default Time
    const gameSize          = 5; //TODO: change this when done testing
    var self                = this;
    var w                   = window.innerWidth;
    var h                   = window.innerHeight;
    var stage               = document.getElementById('stage');
    var startButton         = document.getElementById('startButton');
    var title               = document.getElementById('title');
    var valueTag            = document.getElementById('valueTag')
    var questionTitle       = document.getElementsByClassName("questions");
    var score               = document.getElementsByClassName("score");
    var scoreSpan           = score[0].getElementsByTagName('span');
    var timer               = document.getElementsByClassName("timer");
    var timerSpan           = timer[0].getElementsByTagName('span');
    var gameChoices         = document.getElementById('gameChoices');
    var gameHeader          = document.getElementById('gameHeader');
    var buttonOne           = document.getElementById('buttonOne');
    var buttonTwo           = document.getElementById('buttonTwo');
    var buttonThree         = document.getElementById('buttonThree');
    var buttonFour          = document.getElementById('buttonFour');
    var buttonArray         = [buttonOne, buttonTwo, buttonThree, buttonFour];
    var modal_window        = document.getElementById('modal_window');
    var startAnimation      = new TimelineMax({repeat:0});
    var gameIndex           = 0;
    var actualScore         = 0;
    var actualScoreP2       = 0;
    var playerTurnIndex     = 0;
    var player              = 1;
    var timerIndex          = questionTime;
    var timerObject         = undefined;
    var gameQuestions       = [];
    var gameAnswers         = [];

    // Methods

    // setup event listers for the buttons and recalculate window size
    // this is called at the end animationPipeline()
    self._initialize = function () {
        self.windowWasResized();

        // add start button listener
        startButton.addEventListener('click', self.startGamePlay);
    };

    // this in effect causes the dimensions to be recalculated every time the window is resized
    // Called during self._initialize() to calculate new dimensions
    self.windowWasResized = function () {

        stage.style.height = (h - 20) + 'px';
        stage.style.width = (w - 20) + 'px';
    };

    // Setup the stage and fire off the stage animations
    // called when the start button is pressed
    self.startGamePlay = function () {

        questionTime = parseInt(document.getElementById('demo').innerHTML);
        timerIndex = questionTime;

        // Get the game indexes
        self.generateGameIndexes();

        // Add data to the interface
        self.setupUserInterfaceWithData();

        // Sets player turn label
        scoreSpan[0].textContent = player;
        // Set players 1 and 2s scores
        scoreSpan[1].textContent = actualScore;
        scoreSpan[2].textContent = actualScoreP2;
        // Set Timer label
        timerSpan[0].textContent = timerIndex;

        startAnimation.timeScale(2)
        startAnimation.to([startButton, title, slider, valueTag], 1, { alpha: 0 });
        startAnimation.to([startButton, title, slider, valueTag], 0.1, { css: { display: 'none' } });
        startAnimation.to([gameHeader, gameChoices], 0.1, { css: { display: 'block' }, onComplete: self.fireOffGameLogic });
    };

    // starts the timer
    // Callback function from the startAnimation timeline above
    // this runs at the end of the last animation in self.startGamePlay()
    self.fireOffGameLogic = function () {
        self.runTimer();
    }

    // rebuild the UI with a new question and answer, reload button events
    // called in multiple places as needed
    self.setupUserInterfaceWithData = function () {

        // re (add) answer button listener
        for (var i = 0; i < buttonArray.length; i++) {
            buttonArray[i].addEventListener('click', self.answerClicked, false);
        }

        // Add question to question title button
        var ques = questions[gameQuestions[gameIndex]];
        var quesTitle = questionTitle[0].getElementsByTagName('span');
        quesTitle[0].innerHTML = ques;

        // Add answers to answer buttons
        var ans = answers[gameQuestions[gameIndex]];
        for (var i = 0; i < ans.length; i++) {
            var a = ans[i];
            buttonArray[i].textContent = a;
        }
    };


    // start a gameplay timer that runs every second
    // called in multiple places as needed
    self.runTimer = function () {

        timerObject = window.setInterval(self.updateClock, 1000);
    };

    // Callback function for the gameplay timer above
    // this decrements the gameplay timer every second, going to the next
    // question once the timer runs out, it goes to the end of game once
    // all questions are done
    self.updateClock = function () {

        timerIndex--;
        if (timerIndex == -1) {
            timerIndex = questionTime;
            gameIndex++;
        }

        // end the game
        if (gameIndex == gameQuestions.length) {
            clearTimeout(timerObject);
            self.runEndOfGame();
            return;

        // start next question
        } else if (timerIndex == questionTime) {
            self.setupUserInterfaceWithData();
        }

        // Display updated time
        timerSpan[0].textContent = timerIndex;
    };

    // Determines if an answer is correct or incorrect
    // Displays a message to user and plays sound effect
    // called when an answer button is pressed
    self.answerClicked = function (event) {

        // remove answer button listeners to prevent eronious clicks
        for (var i = 0; i < buttonArray.length; i++) {
            buttonArray[i].removeEventListener('click', self.answerClicked, false);
        }

        // stop timer
        clearTimeout(timerObject);

        // Get the answer index
        var givenAnswerIndex = Number(event.target.getAttribute('data-index'));
        // Get the actual answer index
        var correctAnswerIndex = gameAnswers[gameIndex];

        // Determine if it is player 1 or player 2's turn
        if (playerTurnIndex % 2 == 0) {
            player = 1;
            scoreSpan[0].textContent = 2;
        } else {
            player = 2;
            scoreSpan[0].textContent = 1;
        }

        // Correct answer
        if (correctAnswerIndex == givenAnswerIndex) {
            // Add points to correct players total
            if (player == 1) {
                actualScore += 10;
                scoreSpan[1].textContent = actualScore;
            } else {
                actualScoreP2 += 10;
                scoreSpan[2].textContent = actualScoreP2;
            }
            // cancelButtons = true;
            self.dispatch_modal('YOUR ANSWER IS: <span class="correct">CORRECT!</span>', 500);

        // Incorrect Answer
        } else {
            // cancelButtons = true;
            self.dispatch_modal('YOUR ANSWER IS: <span class="incorrect">INCORRECT!</span>', 500);
        }

        // Increment Player turn index
        playerTurnIndex += 1;
    }

    // This function generates random indexes to be used for our game logic
    // The indexes are used to assign questions and correct answers
    // called on new game
    // TODO: don't just "hope" and repeat until we get a new random number
    self.generateGameIndexes = function () {

        while (gameQuestions.length < gameSize) {

            var randomNumber = Math.floor(Math.random() * questions.length);

            if (gameQuestions.indexOf(randomNumber) == -1) {
                gameQuestions.push(randomNumber);
                gameAnswers.push(correctAnswers[randomNumber]);
            }
        }
    };

    // Dispatches a modal window with a message to user
    // called after answer clicked to display correct or incorrect message
    self.dispatch_modal = function (message, time) {

        window_width = window.innerWidth || document.documentElement.clientWidth
            || document.body.clientWidth;

        modal_window.getElementsByTagName('p')[0].innerHTML = message;
        modal_window.style.left = ((window_width / 2) - 150) + 'px';

        self.fade_in(time, modal_window, false);
    };

    // Credit for the idea about fade_in and fade_out to Todd Motto
    // fade_in function emulates the fadeIn() jQuery function
    // called by self.dispatch_modal() to fade in and out the messages
    // and for end of game messages (persists, doesn't fade out)
    self.fade_in = function (time, elem, persist) {

        var opacity = 0;
        var interval = 50;
        var gap = interval / time;
        // var self = this;

        elem.style.display = 'block';
        elem.style.opacity = opacity;

        var fading = window.setInterval(function () {

            opacity += gap;
            elem.style.opacity = opacity;

            if (opacity >= 1) {

                window.clearInterval(fading);

                // fade out if the element shouldn't persist
                if (!persist) {

                    setTimeout(function () {
                        self.fade_out(time, elem);
                    }, 1500);
                }

            }

        }, interval);
    };

    // Credit for the idea about fade_in and fade_out to Todd Motto
    // fade_out function emulates the fadeOut() jQuery function
    // called by self.fade_in() to remove non persisting messages
    self.fade_out = function (time, elem) {

        var opacity = 1;
        var interval = 50;
        var gap = interval / time;

        var fading = window.setInterval(function () {

            opacity -= gap;
            elem.style.opacity = opacity;

            // fade out finished
            if (opacity <= 0) {

                window.clearInterval(fading);
                elem.style.display = 'none';
                gameIndex++;

                // run another game loop if more questions
                if (gameIndex != gameQuestions.length) {

                    timerIndex = questionTime;
                    timerSpan[0].textContent = timerIndex
                    self.setupUserInterfaceWithData();
                    self.runTimer();

                // otherwise goto end of gamae
                } else {
                    self.runEndOfGame();
                }
            }

        }, interval);
    };

    // Display a modal window with the option to play again
    // Runs when the game ends
    // TODO: center play again button
    self.runEndOfGame = function () {

        window_width = window.innerWidth || document.documentElement.clientWidth
            || document.body.clientWidth;

        scoreSpan[0].textContent = "GAME OVER";

        var playAgainButton = '<button id="playAgain" class="center" style="margin:0 auto" onClick="self.resetGame()">PLAY AGAIN</button>';
        var winnerMessage = ""
        // Determine who the winner is

        if (actualScore > actualScoreP2) {
            winnerMessage = "PLAYER 1 WON!";
        } else if (actualScore < actualScoreP2) {
            winnerMessage = "PLAYER 2 WON!";
        } else {
            winnerMessage = "TOO BAD! YOU TIED!";
        }
        var actualScoreHeader = '<h2 style="text-align:center">' + winnerMessage + '</h2>';
        var insertedHTML = actualScoreHeader + '<div>' + playAgainButton + '</div>';

        modal_window.getElementsByTagName('div')[0].innerHTML = insertedHTML;
        modal_window.style.left = ((window_width / 2) - 150) + 'px';

        self.fade_in(1000, modal_window, true);
    };

    // This function resets the game and starts it all over again
    // This function acts as to reset all data from scratch
    // called when the end of game play again button is pressed
    self.resetGame = function () {

        modal_window.style.opacity = 0.0; // TODO: why not just 0 ???
        modal_window.innerHTML = '<div class="modal_message"><p></p></div>';

        window.clearTimeout(timerObject);
        timerObject = undefined;
        gameIndex = 0;
        gameAnswers = [];
        playerTurnIndex = 0;
        player = 1;
        actualScore = 0;
        actualScoreP2 = 0;
        timerIndex = questionTime;
        gameQuestions = [];
        self.generateGameIndexes();
        self.setupUserInterfaceWithData();
        scoreSpan[0].textContent = actualScore;
        scoreSpan[1].textContent = actualScore;
        scoreSpan[2].textContent = actualScoreP2;
        timerSpan[0].textContent = timerIndex;
        self.runTimer();
    };

    // Initialize the controller
    self._initialize();
}

function shuffle(array) {
    let shuffled_array = [...array]
    shuffled_array.sort(() => Math.random() - 0.5);
    return shuffled_array
}

// process the aproved questions to add them to the question pool
function processData(allText) {

    output = Papa.parse(allText);
    output.data.shift();
    output.data.forEach(entry => {
        if (!entry.includes("")) {
            entry.shift();
            questions.push(entry[0]);

            shuffled_question = shuffle(entry.slice(1,5));
            answers.push(shuffled_question);
            correctAnswers.push(shuffled_question.indexOf(entry[1]));
        }
    });
    console.log(questions);
    console.log(correctAnswers);
    console.log(answers);
}

// create an anonymous function that gets called every .1 seconds using setInterval
// this anonymous function checks to see if the document is ready (downloaded and displayed)
// once this happens it calls the animation pipeline function and clears the interval
// this mean this anonymous function will no longer be called after the animation pipeline starts
// it also then tells the web browser to call animation pipeline anytime the window is resized
var interval = setInterval(function () {

    if (document.readyState === 'complete') {
        clearInterval(interval);

        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "questions/approved_questions.csv",
                dataType: "text",
                success: function (data) {
                    processData(data);
                }
            });
        });

        var pipe = animationPipeline();

        // this breaks the game
        // window.onresize = function (event) {
        //     var pipe = animationPipeline()
        // };
    }
}, 100);
