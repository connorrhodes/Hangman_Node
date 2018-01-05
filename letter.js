var Letter = function(ltr) {
    //stores letter
    this.letter = ltr;
    //boolean to make sure the letter can be shown
    this.appear = false;

    this.letterRender = function() {
        if(this.letter == ' '){
            this.appear = true;//function checks if the word is found and makes sure it doesn't read the blank as false
            return '  ';
        } if(this.appear === false){
            return ' _ ';
        } else {
            return this.letter;//if it is an actual letter, it returns it
        }
    };
};
//to use in word.js
module.exports = Letter;