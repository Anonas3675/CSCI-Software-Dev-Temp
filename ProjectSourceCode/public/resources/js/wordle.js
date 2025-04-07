//Creaye 30 titles and give each of them an id. An id corresponds to row column indices

var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0; //Incrementes each time a guess is made
var col = 0; //current letter

var gameOver = false;
var word = "SQUID";

//Could make an array

window.onload = function(){ //This function is called when the window is loaded
    intialize();
}

function intialize(){
    //Create game board
    for (let r=0; r < height; r++){
        for(let c = 0; c < width; c++){
            //<span id="0-0" class="title"><\span>
            let title = document.createElement("span"); //This creates a new html element a span is similar to a paragraph but without a newline at the end
            title.id = r.toString() + "-" + c.toString();
            title.classList.add("tile");
            title.innerText = "";
            document.getElementById("board").appendChild(title);
        }
    }
    //Listen for Key Press
    document.addEventListener("keyup", (e) => {
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
            update();
            row +=1;
            col = 0;
        }
        
        if(!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

function update(){
    let correct = 0; //Used at the end to check if the word is correct
    for (let c=0; c < width; c++){ //for each letter in the current tow
        let curTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = curTile.innerText;
        
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
    if (correct == width){
        gameOver = true;
    }
}