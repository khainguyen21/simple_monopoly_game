
let nodeList;

let currentpos = 0;
let currentpos2 = 0;
let turn = 0;

let player1Balance = 3000;
let player2Balance = 3000;
let currentPlayer = 1;

const Properties1 = [];
const Properties2 = [];

const button = document.querySelector("#RollDice");

const takeAChanceText = ["Second Place in Beauty Contest: $10", "Bank Pays You Dividend of $50",
"Repair your Properties. You owe $250", "Speeding Fine: $15", "Holiday Fund Matures: Receive $100", 
"Pay Hospital Fees: $100"];
const takeAChanceMoney = [-10, -50, 250, 15, -100, 100];


onload=()=>{

document.querySelector("#RollDice").onclick=RollDice;

let nodeList=document.querySelectorAll("section");
    for (let count=0; count<nodeList.length; count++){
    let posnStr=nodeList[count].getAttribute("suite");
    let rowNo=parseInt(posnStr.substring(0,2));
    let colNo=parseInt(posnStr.substring(2,4));
    nodeList[count].style.setProperty("grid-row",`${rowNo}/${rowNo+1}`);
    nodeList[count].style.setProperty("grid-column",`${colNo}/${colNo+1}`);
    }
        
}

function RollDice()
{
    //get the picture
    const player1Img = document.getElementById("player1Img");
    const player2Img = document.getElementById("player2Img");


    // Disable the roll dice button 
    document.querySelector("#RollDice").disabled=true;

    //Get the dice value
    // Returns a random integer from 1 to 6:
    let dice1=Math.floor(Math.random()*6)+1;
    let dice2=Math.floor(Math.random()*6)+1;

    let dice1Image = document.createElement("img");
    dice1Image.src = "img/dice" + dice1 + ".png";
    dice1Image.setAttribute("width", "160px");
    
    let dice2Image = document.createElement("img");
    dice2Image.src = "img/dice" + dice2 + ".png"; 
    dice2Image.setAttribute("width", "160px");

    let elem = document.querySelector("#dice1");
    
    //if there's picture of dice1 already there
    if (elem.firstChild)
    {
        elem.removeChild(elem.firstChild);
    }
    elem.appendChild(dice1Image);
    

    let elem2 = document.querySelector("#dice2");
    //if there's picture of dice1 already there
    if (elem2.firstChild)
    {
        elem2.removeChild(elem2.firstChild);
    }
    elem2.appendChild(dice2Image);

    let totaldice = dice1 + dice2; 

    //set first turn for player 1
    if (turn == 0)
    {
        player1Img.classList.add("border");
        player2Img.classList.remove("border");

        // player1Img.style.border = "2px solid red"; 
        // player2Img.style.border = "none";  

        movePlayer1(totaldice);
        turn = 1; //set back turn to 1 for player 2
        document.querySelector("#RollDice").disabled=false;
        currentPlayer = 1;
        
        //if player 1 gets same value of the dice 
        if (dice1 == dice2)
        {
            turn = 0; //rolling the dice 1 more time
        }
    }

    else if (turn == 1)
    {
        player1Img.classList.remove("border");
        player2Img.classList.add("border");

        // player1Img.style.border = "none";
        // player2Img.style.border = "2px solid red";

        movePlayer2(totaldice);
        turn = 0;
        document.querySelector("#RollDice").disabled=false;
        currentPlayer = 2;

        if (dice1 == dice2)
        {
            turn = 1;
        }

    }
    


}


function movePlayer1 (totaldice)
{
    currentPlayer = 1;

    //get all value from the section tag 
    const sections = document.querySelectorAll("section[val]");
    const vals = [];
    for (let i = 0; i < sections.length; i++) {
      vals.push(parseInt(sections[i].getAttribute("val")));
    }

    //get the new position for player 1
    currentpos += totaldice;

    //get all section
    nodeList = document.querySelectorAll("section");
    
    //if player 1 pass the start point
    if(currentpos > 39)
    {
        currentpos = currentpos - 40;
        updateBalance(vals[0]);
        alert("You're just earning $200");
    }
    
    //if player 1 is in the jail
    if (currentpos == 30)
    {
        currentpos = 10;
        alert("Go to jail");
    }
    
    //if player 1 is in the tax
    if(currentpos == 38)
    {
        alert("You have to pay tax for $100");
    }
    
    //if player 1 is in the tax
    if (currentpos == 4)
    {
        alert("You have to pay tax for $200");
    }

    //if player 1 is in the chance and community chest
    if (currentpos == 2 ||currentpos == 17||currentpos == 7 || currentpos == 22 ||currentpos == 33 || currentpos == 36)
    {
        randomNum = Math.floor(Math.random() * 6);
        alert(takeAChanceText[randomNum]);
        updateBalance(parseInt(takeAChanceMoney[randomNum]));
    }


    //get image of player 1
    let playerToken = document.getElementById("player1");

    //if there's picture of player 1 already there
    if (playerToken.firstChild)
    {
        playerToken.removeChild(playerToken.firstChild);
    }

    //if player 1 is not in the chance and community chest
    if (currentpos != 2 &&currentpos != 17 && currentpos != 7 && currentpos != 22 &&currentpos != 33 && currentpos != 36 && currentpos != 10 && currentpos != 3 && currentpos != 18 && currentpos != 20 && currentpos != 12)
    {
        // nodeList[currentpos].style.backgroundColor = 'rgb(80, 251, 80)'; 
        nodeList[currentpos].classList.add("player1"); 
        

    }
    
    if(currentpos != 0)
    {
        updateBalance(vals[currentpos]); 
        nodeList[currentpos].appendChild(playerToken);

        // alert("This is player 1: " + vals[currentpos]);
    }

    //save all the property that player 1 landed on 
    Properties1.push(nodeList[currentpos]);


}




//Player 2 
function movePlayer2 (totaldice)
{
    currentPlayer = 2 ;
    
    //get all the values for each section and push it in vals[] 
    const sections = document.querySelectorAll("section[val]");
    const vals = [];
    for (let i = 0; i < sections.length; i++) {
      vals.push(parseInt(sections[i].getAttribute("val")));
    }

    //set how many space the player 2 has to go 
    currentpos2 += totaldice;

    //get all the section
    nodeList = document.querySelectorAll("section");


    //if player 2 finished the cycle 
    if(currentpos2 > 39)
    {
        currentpos2 = currentpos2 - 40;
        updateBalance(vals[0]);
        alert("You're just earning $200");
    }

    //if the player 2 landed on Go To Jail Seciton 
    if (currentpos2 == 30)
    {
        currentpos2 = 10;
        alert("Go to jail");
        updateBalance(parseInt("50"));
    }

    //if the player 2 landed on Tax Section
    if(currentpos2 == 38)
    {
        alert("You have to pay tax for $100");
    }

    //if the player 2 landed on Tax Section
    if (currentpos2 == 4)
    {
        alert("You have to pay tax for $200");
    }

    //if the player 2 landed on Chance or Community Chest Section
    if (currentpos2 == 2 ||currentpos2 == 17||currentpos2 == 7 || currentpos2 == 22 ||currentpos2 == 33 || currentpos2 == 36)
    {
        randomNum = Math.floor(Math.random() * 6);
        alert(takeAChanceText[randomNum]);
        updateBalance(parseInt(takeAChanceMoney[randomNum]));
    }
    
    //get the picture of player 2   
    let playerToken1 = document.getElementById("player2");

    //display image of player 2 on where it landed on 
    if (playerToken1.firstChild)
    {
        playerToken1.removeChild(playerToken1.firstChild);
    }

    //if the player 2 is not in community chest or chance section
    if (currentpos2 != 2 && currentpos2 != 17 && currentpos2 != 7 && currentpos2 != 22 &&currentpos2 != 33 && currentpos2 != 36 && currentpos2 != 10 && currentpos2 != 4 && currentpos2 != 18 && currentpos2 != 20 && currentpos2 != 12)
    {
        // nodeList[currentpos2].style.backgroundColor = 'pink';
        nodeList[currentpos2].classList.add("player2"); 

    }


    if (currentpos2 != 0)
    {
        nodeList[currentpos2].appendChild(playerToken1);
        updateBalance(vals[currentpos2]); 
        // alert("This is player 2: " + currentpos2);
    }
    

    //save the properties where player 2 has already paid it
    Properties2.push(nodeList[currentpos2]);

}

function updateBalance(amount)
{
    
    if (currentPlayer == 1)
    {

        player1Balance -= amount; 

        document.getElementById("player1amt").innerHTML = "$" + player1Balance;
        if (player1Balance < 0)
        {
            alert("Player 1 is bankrupt");
            button.disabled = true; // disable the button
            alert("Player 2 won");
        }
    }
    else if (currentPlayer == 2)
    {
        player2Balance -= amount; 
        
        document.getElementById("player2amt").innerHTML = "$" + player2Balance;

        if (player2Balance < 0)
        {            
            alert("Player 2 is bankrupt");
            button.disabled = true; // disable the button
            alert("Player 1 won");  
            
        }
    }
}


// || nodeList[currentpos2] != Properties2[i]
// else 
// {
//     alert("You already own this property");
//     updateBalance(vals[i]/10);
// }