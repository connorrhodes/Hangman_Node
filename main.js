var inquirer = require('inquirer');
var isLetter = require('is-letter');

var Word = require('./word.js');
var Game = require('./game.js');
//the price of failure
var displayTheHangingMan = Game.newWord.hangman;

require('events').EventEmitter.prototype._maxListeners = 100;

var hangman = {
    //associates with the wordList array in game.js
    wordBank: Game.newWord.wordList,
    guessesRemaining: 10,
    //array for letters you've used
    guessedLetters: [],
    //indicates the hangman display at default showing nothing
    display: 0,
    currentWord: null,

    startGame: function () {
        var that = this;

        if (this.guessedLetters.length > 0) {
            this.guessedLetters = [];

        }
        inquirer.prompt([{
            name: "play",
            type: "confirm",
            message: "Ready to hang?"
        }]).then(function (answer) {
            if (answer.play) {
                that.newGame();
            } else {
                console.log("Don't leave me");
            }
        })
    },
    newGame: function () {
        if (this.guessesRemaining === 10) {
            console.log("------------------------------");
            console.log("Here we go again..");
            console.log("\n------------------------------");
            //generates random number based on the wordBank
            var randNum = Math.floor(Math.random() * this.wordBank.length);
            this.currentWord = new Word(this.wordBank[randNum]);
            this.currentWord.getLets();
            //displays current word as blanks.
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
        var that = this;
        //prompts user for a letter
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
        }]).then(function (ltr) {
            //toUpperCase because words in word bank are all caps
            var letterReturned = (ltr.theChosenYuan).toUpperCase();
            //adds to the guessedLetters array if it isn't already there
            var guessedAlready = false;
            for (var i = 0; i < that.guessedLetters.length; i++) {
                if (letterReturned === that.guessedLetters[i]) {
                    guessedAlready = true;
                }
            }
            //if the letter wasn't guessed already run through entire function, else reprompt user
            if (guessedAlready === false) {
                that.guessedLetters.push(letterReturned);

                var found = that.currentWord.checkIfLetterFound(letterReturned);
                //if none were found tell user they were wrong
                if (found === 0) {
                    console.log('Nope! You guessed wrong.');
                    that.guessesRemaining--;
                    that.display++;
                    console.log('Guesses remaining: ' + that.guessesRemaining);
                    //wrong answers build up the hangman
                    console.log(displayTheHangingMan[(that.display) - 1]);
                    //displays the hidden word/sentence
                    console.log('\n*******************');
                    console.log(that.currentWord.wordRender());
                    console.log('\n*******************');

                    console.log("Letters guessed: " + that.guessedLetters);
                } else {
                    console.log('Yes! You guessed right!');
                    //checks to see if user won
                    if (that.currentWord.didWeFindTheWord() === true) {
                        console.log(that.currentWord.wordRender());
                        console.log('Congratulations! You won the game!!!');
                        // that.startGame();
                    } else {
                        // display the user how many guesses remaining
                        console.log('Guesses remaining: ' + that.guessesRemaining);
                        console.log(that.currentWord.wordRender());
                        console.log('\n------------------------------');
                        console.log("Letters guessed: " + that.guessedLetters);
                    }
                }
                if (that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
                    that.keepPokingTheUser();
                } else if (that.guessesRemaining === 0) {
                    console.log('Game over!');
                    console.log('The word you were guessing was: ' + that.currentWord.word);
                }
            } else {
                console.log("You've guessed that letter already. Try again.")
                that.keepPokingTheUser();
            }
        });
    }
}
hangman.startGame();
