//Creaye 30 titles and give each of them an id. An id corresponds to row column indices

var height = 6; //number of guesses
var width = 5; //length of the word. This is the default value and gets changed later on

var row = 0; //Incrementes each time a guess is made
var col = 0; //current letter

var gameOver = false;
var word = "SQUID";
width = word.length;
height = width + 1;


window.onload = async function(){ //This function is called when the window is loaded
    try{
        await intialize();
    }
    catch(err){
        console.error('Something went wrong:', err);
    }
}

//This gets called when the page is loaded
//Need to add a method to get all previously made guesses
async function intialize(){
    //Create game board
    try{
        document.getElementById("board").style.width = ((width*65)) + 'px';
        document.getElementById("board").style.height = ((height*60) + 60) + 'px';
        const guesses = await getGuesses();
        for (let r=0; r < height; r++){
            let guess = "";
            if(r < guesses.length){
                guess = guesses[r];
            }
            for(let c = 0; c < width; c++){
                //<span id="0-0" class="title"><\span>
                let title = document.createElement("span"); //This creates a new html element a span is similar to a paragraph but without a newline at the end
                title.id = r.toString() + "-" + c.toString();
                title.classList.add("tile");
                if (r < guesses.length){
                    title.innerText = guess[c];
                }
                else{
                    title.innerText = "";
                }
                document.getElementById("board").appendChild(title);
            }
            if(r < guesses.length){
                update(1);
                row+=1;
            }
        }
        //Listen for Key Press
        document.addEventListener("keyup", async (e) => {
            if(gameOver) return;
            //alert(e.code); //e.code contains the key that was pressed. Alert causes the webrowser to send an alert to the user
            if(("KeyA" <= e.code) && (e.code <= "KeyZ")){
                if (col < width){
                    let curTile = document.getElementById(row.toString() + "-" + col.toString());
                    if(curTile.innerText == ""){ //If a letter hasn't been added
                        
                        curTile.innerText = e.code[3];
                        col +=1;
                    }
                } 
            }
            else if(e.code == "Backspace"){
                if(0 < col && col <= width){
                    col -=1;
                    let curTile = document.getElementById(row.toString() + "-" + col.toString());
                    curTile.innerText = "";
                }
            }
            else if(e.code == "Enter"){
                if (col != width) return;
                const valid = await checkIfWord();
                if(!valid){
                    alert("Please enter a valid word");
                    return;
                }
                update(0);
                row +=1;
                col = 0;
            }
            
            if(!gameOver && row == height){
                gameOver = true;
                document.getElementById("answer").innerText = word;
                updateWordleStats(false);
              }
        })
    } catch(err){
        console.error('Something went wrong:', err);
    }

}
//Used to see if the word is a valid word
async function checkIfWord(){
    guess = "";
    for (let c=0; c < width; c++){ //Gets the guess by from the HTML
        let curTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = curTile.innerText;
        guess += letter;
    }

    try{
        //Make a call to a function in index.js, which will then make a call to the API
        const res = await fetch('/checkguess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess })
          });
      
          const data = await res.json();
          //console.log(data); //Prints the response to the terminal
          if(data.valid){
            console.log(`${guess} is a valid word!`);
            return 1;
          } else {
            console.log(`${guess} is not valid.`);
            return 0;
          }
    } catch(err){
        console.error('Something went wrong:', err);
    }
}

async function updateWordleStats(didWin) {
    try {
      const res = await fetch('/update-wordle-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ won: didWin })
      });
      const data = await res.json();
      console.log('Wordle stats updated:', data);
    } catch (err) {
      console.error('Error updating Wordle stats:', err);
    }
  }
  

function update(intializiation){
    let correct = 0; //Used at the end to check if the word is correct
    guess = "";
    for (let c=0; c < width; c++){ //for each letter in the current tow
        let curTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = curTile.innerText;
        guess += letter;
        
        //If the letter is in the correct location, set class to correct
        //If the letter is in the word (check this by iterating through word indexes) set class to present
        //Otherwise, set class to absent
        if(word[c] == letter){
            curTile.classList.add("correct");
            correct +=1;
        }
        else if (word.includes(letter)){
            curTile.classList.add("present");
        }
        else{
            curTile.classList.add("absent");
        }
    }
    //Want to call update without doing this
    if(intializiation == 0){
        submitGuess(guess);
        if(correct == width){
            updateWordleStats(true); 
        }
    }
    if (correct == width){
        gameOver = true;
    }
}

//This should be called when a guess is made (i.e, enter is pressed)
async function submitGuess(guess) {
    try{
      const res = await fetch('/saveguess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
      });
  
      const data = await res.json();
      console.log(data); //Prints the response to the terminal

    } catch(err){
      console.error('Something went wrong:', err);
    }
}

async function getGuesses() {
    try{
        const res = await fetch('/getguess');
        const data = await res.json();
        console.log(data); //Prints the response to the terminal
        return data;
    } catch(err){
      console.error('Something went wrong:', err);
      return [];
    }
}
