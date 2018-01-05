var inquirer = require('inquirer');
var isLetter = ('is-letter');

var Word = require('./word.js');
var Game = require('./game.js');

var displayTheHangingMan = Game.newWord.hangman;

require('events').EventEmitter.prototype._maxListeners = 100;

var hangman = {
    wordBank: Game.newWord.wordList,
    guessesRemaining: 10,

    guessedLetters: [],

    display: 0,
    currentWord: null,

    startGame: function () {
        var itMightBeThat = this;

        if (this.guessedLetters.length > 0) {
            this.guessedLetters = [];

        }
        inquirer.prompt([{
            name: "play",
            type: "confirm",
            message: "Ready to hang?"
        }]).then(function (answer) {
            if (answer.play) {
                itMightBeThat.newGame();
            } else {
                console.log("Don't leave me");
            }
        })},
    newGame: function () {
        if (this.guessesRemaining === 10) {
            console.log("------------------------------");
            console.log("Here we go again...");
            console.log("------------------------------");

            var randNum = Math.floor(Math.random() * this.wordBank.length);
            this.currentWord = Word(this.wordBank[randNum]);
            this.currentWord.getLets();//UnhandledPromiseRejectionWarning

            console.log(this.currentWord.wordRender());
            this.keepPokingTheUser();
        } else {
            this.resetGuessesRemaining();
            this.newGame();
        }
    },
    resetGuessesRemaining: function () {
        this.guessesRemaining = 10;
    },
    keepPokingTheUser: function () {
        var itMightBeThat = this;

        inquirer.prompt([{
            name: "theChosenYuan",
            type: "input",
            message: "Choose a letter: ",
            validate: function (value) {
                if (isLetter(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function(ltr) {
            var letterReturned = (ltr.theChosenYuan).toUpperCase();

            var guessedAlready = false;
            for (var i = 0; i < itMightBeThat.guessedLetters.length; i++) {
                if (letterReturned === itMightBeThat.guessedLetters[i]) {
                    guessedAlready = true;
                }
            }
            if (guessedAlready === false) {
                itMightBeThat.guessedLetters.push(letterReturned);

                var found = itMightBeThat.currentWord.checkIfLetterFound(letterReturned);
                if (found === 0) {
                    console.log('Wrong!');
                    itMightBeThat.guessesRemaining--;
                    itMightBeThat.display++;
                    console.log('Guesses remaining: ' + itMightBeThat.guessesRemaining);
                    console.log(displayTheHangingMan[(itMightBeThat.display) - 1]);

                    console.log("\n------------------------------");
                    console.log(itMightBeThat.currentWord.wordRender());
                    console.log("\n------------------------------");

                    console.log("Letters guessed: " + itMightBeThat.guessedLetters);
                
            } else {
                console.log('Holy crap! You guessed it right!');

                if (itMightBeThat.currentWord.iMightveFoundTheWord() === true) {
                    console.log(itMightBeThat.currentWord.wordRender());
                    console.log('You won the game!');

                } else {
                    console.log('Guesses remaining: ' + itMightBeThat.guessesRemaining);
                    console.log(itMightBeThat.currentWord.wordRender());
                    console.log("\n------------------------------");
                    console.log("Letters guessed: " + itMightBeThat.guessedLetters);

                }
            }
            if(itMightBeThat.guessesRemaining > 0 && itMightBeThat.currentWord.wordFound === false){
                itMightBeThat.keepPokingTheUser();
            } else if(itMightBeThat.guessesRemaining === 0) {
                console.log('Game over!');
                console.log('The word you tried to guess and failed miserabily: ' + itMightBeThat.currentWord.word);
            }
            } else {
                console.log("You already said that.... try again.");
                itMightBeThat.keepPokingTheUser();
            }
            
        });
    }  
}
hangman.startGame();
