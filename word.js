
var Letter = require('./letter.js');

function Word(wrd){
    var that = this;
    //stores the word string
    this.word = wrd;
    //collects the letter objects
    this.letters = [];
    this.wordFound = false;

    this.getLets = function() {
        //function to populate the letter objects

        for(var i = 0; i < that.word.length; i++){
            var newLetter = new Letter(that.word[i]);
            this.letters.push(newLetter);
        }
    };
    //if the user finds the current word
    this.didWeFindTheWord = function() {
        if(this.letters.every(function(lttr){
            return lttr.appear === true;
        })){
            this.wordFound = true;
            return true;
        }
        
    };
    //function to check if letter matches 
    this.checkIfLetterFound = function(guessedLetter) {
        var whatToReturn = 0;

        this.letters.forEach(function(lttr){
            if(lttr.letter === guessedLetter){
                lttr.appear = true;
                whatToReturn++;
            }
        })
        //if the guess matches a letter property, it returns
        return whatToReturn;
    };
    //renders the word from wordList wiether it is guessed or not
    this.wordRender = function() {
        var display = '';

        that.letters.forEach(function(lttr){
            var currentLetter = lttr.letterRender();
            display+= currentLetter;
        });
        return display;
    };


}
module.exports = Word;