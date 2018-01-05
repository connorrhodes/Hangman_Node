var inquirer = require('inquirer');
var isLetter = require('is-letter');

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
        })},
    newGame: function() {
    if(this.guessesRemaining === 10) {
        console.log("------------------------------");
        console.log("Here we go again..");
        console.log("\n------------------------------");
      //generates random number based on the wordBank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();
      //displays current word as blanks.
      console.log(this.currentWord.wordRender());
      this.keepPokingTheUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
    resetGuessesRemaining: function () {
        this.guessesRemaining = 10;
    },
    keepPokingTheUser: function () {
        var that = this;

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
            for (var i = 0; i < that.guessedLetters.length; i++) {
                if (letterReturned === that.guessedLetters[i]) {
                    guessedAlready = true;
                }
            }
            if (guessedAlready === false) {
                that.guessedLetters.push(letterReturned);

                var found = that.currentWord.checkIfLetterFound(letterReturned);
                if (found === 0) {
                    console.log('Wrong!');
                    that.guessesRemaining--;
                    that.display++;
                    console.log('Guesses remaining: ' + that.guessesRemaining);
                    console.log(displayTheHangingMan[(that.display) - 1]);

                    console.log("\n------------------------------");
                    console.log(that.currentWord.wordRender());
                    console.log("\n------------------------------");

                    console.log("Letters guessed: " + that.guessedLetters);
                
            } else {
                console.log('Holy crap! You guessed it right!');

                if (that.currentWord.iMightveFoundTheWord() === true) {
                    console.log(that.currentWord.wordRender());
                    console.log('You won the game!');

                } else {
                    console.log('Guesses remaining: ' + that.guessesRemaining);
                    console.log(that.currentWord.wordRender());
                    console.log("\n------------------------------");
                    console.log("Letters guessed: " + that.guessedLetters);

                }
            }
            if(that.guessesRemaining > 0 && that.currentWord.wordFound === false){
                that.keepPokingTheUser();
            } else if(that.guessesRemaining === 0) {
                console.log('Game over!');
                console.log('The word you tried to guess and failed miserabily: ' + that.currentWord.word);
            }
            } else {
                console.log("You already said that.... try again.")
                that.keepPokingTheUser();
            }
            
        });
    }  
}
hangman.startGame();
