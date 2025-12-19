// ===== MONOPOLY GAME =====

// Game State
const gameState = {
    players: [
        { position: 0, balance: 1500, properties: [], inJail: false, jailTurns: 0 },
        { position: 0, balance: 1500, properties: [], inJail: false, jailTurns: 0 }
    ],
    currentPlayer: 0,
    doublesCount: 0,
    gameOver: false
};

// Board spaces (40 spaces total, indexed 0-39)
const boardSpaces = [];

// Chance and Community Chest Cards
const chanceCards = [
    { text: "Advance to GO! Collect $200", action: "moveTo", value: 0 },
    { text: "Bank pays you dividend of $50", action: "receive", value: 50 },
    { text: "Go back 3 spaces", action: "moveBack", value: 3 },
    { text: "Go directly to Jail", action: "jail", value: 0 },
    { text: "Make general repairs: Pay $25", action: "pay", value: 25 },
    { text: "Speeding fine: Pay $15", action: "pay", value: 15 },
    { text: "You have been elected Chairman of the Board: Pay $50", action: "pay", value: 50 },
    { text: "Your building loan matures: Collect $150", action: "receive", value: 150 },
    { text: "You have won a crossword competition: Collect $100", action: "receive", value: 100 },
    { text: "Get out of Jail Free!", action: "none", value: 0 }
];

const communityChestCards = [
    { text: "Advance to GO! Collect $200", action: "moveTo", value: 0 },
    { text: "Bank error in your favor: Collect $200", action: "receive", value: 200 },
    { text: "Doctor's fees: Pay $50", action: "pay", value: 50 },
    { text: "From sale of stock you get $50", action: "receive", value: 50 },
    { text: "Go directly to Jail", action: "jail", value: 0 },
    { text: "Holiday fund matures: Receive $100", action: "receive", value: 100 },
    { text: "Income tax refund: Collect $20", action: "receive", value: 20 },
    { text: "Life insurance matures: Collect $100", action: "receive", value: 100 },
    { text: "Pay hospital fees: $100", action: "pay", value: 100 },
    { text: "Pay school fees: $50", action: "pay", value: 50 },
    { text: "Receive $25 consultancy fee", action: "receive", value: 25 },
    { text: "You inherit $100", action: "receive", value: 100 },
    { text: "Second prize in beauty contest: Collect $10", action: "receive", value: 10 }
];

// DOM Elements
let rollButton, dice1El, dice2El, diceTotalEl, gameMessageEl;
let player1Card, player2Card, player1AmtEl, player2AmtEl;
let modal, modalIcon, modalTitle, modalMessage, modalClose;
let gameOverModal, winnerTitle, winnerMessage, restartBtn;
let player1Token, player2Token;

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

function initGame() {
    // Get DOM elements
    rollButton = document.getElementById('RollDice');
    dice1El = document.getElementById('dice1');
    dice2El = document.getElementById('dice2');
    diceTotalEl = document.getElementById('diceTotal');
    gameMessageEl = document.getElementById('gameMessage');
    player1Card = document.getElementById('player1div');
    player2Card = document.getElementById('player2div');
    player1AmtEl = document.getElementById('player1amt');
    player2AmtEl = document.getElementById('player2amt');
    modal = document.getElementById('modal');
    modalIcon = document.getElementById('modalIcon');
    modalTitle = document.getElementById('modalTitle');
    modalMessage = document.getElementById('modalMessage');
    modalClose = document.getElementById('modalClose');
    gameOverModal = document.getElementById('gameOverModal');
    winnerTitle = document.getElementById('winnerTitle');
    winnerMessage = document.getElementById('winnerMessage');
    restartBtn = document.getElementById('restartBtn');

    // Setup board grid positions
    setupBoard();
    
    // Create player tokens
    createPlayerTokens();
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
    modalClose.addEventListener('click', closeModal);
    restartBtn.addEventListener('click', restartGame);
    
    // Set initial turn indicator
    updateTurnIndicator();
    updateBalanceDisplay();
    
    // Place tokens at GO
    moveTokenToPosition(0, 0);
    moveTokenToPosition(1, 0);
}

function setupBoard() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const posStr = section.getAttribute('suite');
        if (posStr) {
            const rowNo = parseInt(posStr.substring(0, 2));
            const colNo = parseInt(posStr.substring(2, 4));
            section.style.gridRow = `${rowNo}/${rowNo + 1}`;
            section.style.gridColumn = `${colNo}/${colNo + 1}`;
        }
        boardSpaces.push(section);
    });
}

function createPlayerTokens() {
    // Create token for player 1
    player1Token = document.createElement('div');
    player1Token.className = 'player-token token-p1';
    player1Token.id = 'token-p1';
    
    // Create token for player 2
    player2Token = document.createElement('div');
    player2Token.className = 'player-token token-p2';
    player2Token.id = 'token-p2';
    
    // Add tokens to GO space
    boardSpaces[0].appendChild(player1Token);
    boardSpaces[0].appendChild(player2Token);
}

function rollDice() {
    if (gameState.gameOver) return;
    
    rollButton.disabled = true;
    
    // Animate dice
    dice1El.classList.add('rolling');
    dice2El.classList.add('rolling');
    
    // Generate random dice values
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    const isDoubles = dice1 === dice2;
    
    // Show dice after animation
    setTimeout(() => {
        dice1El.classList.remove('rolling');
        dice2El.classList.remove('rolling');
        
        // Display dice faces
        displayDice(dice1El, dice1);
        displayDice(dice2El, dice2);
        
        // Show total
        diceTotalEl.textContent = `Total: ${total}`;
        diceTotalEl.classList.add('show');
        
        // Process the move
        setTimeout(() => {
            processMove(total, isDoubles);
        }, 500);
    }, 500);
}

function displayDice(diceEl, value) {
    // Clear previous dots
    diceEl.innerHTML = '';
    
    // Dot positions for each dice value (using 3x3 grid)
    const dotPositions = {
        1: [5],
        2: [1, 9],
        3: [1, 5, 9],
        4: [1, 3, 7, 9],
        5: [1, 3, 5, 7, 9],
        6: [1, 3, 4, 6, 7, 9]
    };
    
    // Create 9 cells for the grid
    for (let i = 1; i <= 9; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (dotPositions[value].includes(i)) {
            dot.style.display = 'block';
        }
        diceEl.appendChild(dot);
    }
}

function processMove(total, isDoubles) {
    const player = gameState.players[gameState.currentPlayer];
    const playerNum = gameState.currentPlayer + 1;
    
    // Handle doubles
    if (isDoubles) {
        gameState.doublesCount++;
        if (gameState.doublesCount >= 3) {
            // Three doubles = go to jail
            showModal('🚔', 'Speeding!', `Player ${playerNum} rolled doubles three times! Go to Jail!`);
            sendToJail(gameState.currentPlayer);
            endTurn(false);
            return;
        }
    } else {
        gameState.doublesCount = 0;
    }
    
    // Handle jail
    if (player.inJail) {
        if (isDoubles) {
            player.inJail = false;
            player.jailTurns = 0;
            showModal('🎉', 'Freedom!', `Player ${playerNum} rolled doubles and is out of jail!`);
        } else {
            player.jailTurns++;
            if (player.jailTurns >= 3) {
                player.inJail = false;
                player.jailTurns = 0;
                updateBalance(gameState.currentPlayer, -50);
                showModal('💰', 'Bail Paid', `Player ${playerNum} paid $50 bail after 3 turns.`);
            } else {
                showModal('🔒', 'Still in Jail', `Player ${playerNum} is still in jail. Turn ${player.jailTurns}/3`);
                endTurn(false);
                return;
            }
        }
    }
    
    // Calculate new position
    const oldPos = player.position;
    let newPos = (oldPos + total) % 40;
    
    // Check if passed GO
    const passedGo = newPos < oldPos && oldPos !== 0;
    
    // Update player position
    player.position = newPos;
    
    // Animate token movement step by step
    animateTokenMovement(gameState.currentPlayer, oldPos, newPos).then(() => {
        // After animation completes, handle passed GO and process landing
        if (passedGo) {
            updateBalance(gameState.currentPlayer, 200);
            showModal('💵', 'Passed GO!', `Player ${playerNum} collected $200 for passing GO!`);
        }
        
        // Process landing space after animation
        setTimeout(() => {
            processLanding(newPos, isDoubles);
        }, passedGo ? 100 : 300);
    });
}

function moveTokenToPosition(playerIndex, position) {
    const token = playerIndex === 0 ? player1Token : player2Token;
    const targetSpace = boardSpaces[position];
    
    // Remove token from current parent
    if (token.parentNode) {
        token.parentNode.removeChild(token);
    }
    
    // Add token to new space
    targetSpace.appendChild(token);
}

function animateTokenMovement(playerIndex, startPos, endPos) {
    return new Promise((resolve) => {
        const token = playerIndex === 0 ? player1Token : player2Token;
        let currentPos = startPos;
        
        // Calculate total steps (handle wrapping around the board)
        let totalSteps;
        if (endPos >= startPos) {
            totalSteps = endPos - startPos;
        } else {
            totalSteps = (40 - startPos) + endPos;
        }
        
        if (totalSteps === 0) {
            resolve();
            return;
        }
        
        let stepsCompleted = 0;
        const stepDelay = 150; // ms between each step
        
        function moveOneStep() {
            // Move to next position
            currentPos = (currentPos + 1) % 40;
            stepsCompleted++;
            
            // Move token to this space
            const targetSpace = boardSpaces[currentPos];
            if (token.parentNode) {
                token.parentNode.removeChild(token);
            }
            targetSpace.appendChild(token);
            
            // Add hop animation
            token.classList.add('hopping');
            setTimeout(() => {
                token.classList.remove('hopping');
            }, 200);
            
            // Check if we've reached the destination
            if (stepsCompleted < totalSteps) {
                setTimeout(moveOneStep, stepDelay);
            } else {
                resolve();
            }
        }
        
        // Start the animation
        setTimeout(moveOneStep, stepDelay);
    });
}

function processLanding(position, isDoubles) {
    const player = gameState.players[gameState.currentPlayer];
    const playerNum = gameState.currentPlayer + 1;
    const space = boardSpaces[position];
    const spaceVal = parseInt(space.getAttribute('val')) || 0;
    const spaceId = space.id;
    
    // Update message
    const spaceName = getSpaceName(space);
    gameMessageEl.textContent = `Player ${playerNum} landed on ${spaceName}`;
    
    // Handle different space types
    if (space.classList.contains('go')) {
        // GO space - already handled if passed
    } else if (spaceId === 'gotojail') {
        // Go to Jail
        showModal('👮', 'Go to Jail!', `Player ${playerNum} must go directly to Jail!`);
        sendToJail(gameState.currentPlayer);
        endTurn(false);
        return;
    } else if (space.classList.contains('jail')) {
        // Just visiting jail
        showModal('👀', 'Just Visiting', `Player ${playerNum} is just visiting the jail.`);
    } else if (space.classList.contains('parking')) {
        // Free parking - nothing happens
        showModal('🅿️', 'Free Parking', `Player ${playerNum} takes a rest on Free Parking.`);
    } else if (space.classList.contains('tax')) {
        // Tax space
        const taxAmount = spaceVal;
        updateBalance(gameState.currentPlayer, -taxAmount);
        showModal('💎', 'Tax Due!', `Player ${playerNum} must pay $${taxAmount} in taxes!`);
    } else if (space.classList.contains('chance')) {
        // Chance
        drawCard('chance');
        return;
    } else if (space.classList.contains('cc')) {
        // Community Chest
        drawCard('community');
        return;
    } else if (space.classList.contains('property') || space.classList.contains('rr') || space.classList.contains('utility')) {
        // Property space
        handleProperty(space, spaceVal);
        return;
    }
    
    endTurn(isDoubles);
}

function handleProperty(space, price) {
    const playerNum = gameState.currentPlayer + 1;
    const otherPlayer = gameState.currentPlayer === 0 ? 1 : 0;
    const spaceName = getSpaceName(space);
    
    // Check if already owned
    if (gameState.players[gameState.currentPlayer].properties.includes(space.id)) {
        showModal('🏠', 'Your Property', `Player ${playerNum} already owns ${spaceName}.`);
    } else if (gameState.players[otherPlayer].properties.includes(space.id)) {
        // Pay rent (10% of property value)
        const rent = Math.floor(price * 0.1);
        updateBalance(gameState.currentPlayer, -rent);
        updateBalance(otherPlayer, rent);
        showModal('💸', 'Rent Due!', `Player ${playerNum} pays $${rent} rent to Player ${otherPlayer + 1} for ${spaceName}!`);
    } else {
        // Buy property
        if (gameState.players[gameState.currentPlayer].balance >= price) {
            updateBalance(gameState.currentPlayer, -price);
            gameState.players[gameState.currentPlayer].properties.push(space.id);
            space.classList.add(gameState.currentPlayer === 0 ? 'owned-p1' : 'owned-p2');
            showModal('🎉', 'Property Purchased!', `Player ${playerNum} bought ${spaceName} for $${price}!`);
        } else {
            showModal('❌', 'Cannot Afford', `Player ${playerNum} cannot afford ${spaceName} ($${price}).`);
        }
    }
    
    endTurn(false);
}

function drawCard(type) {
    const cards = type === 'chance' ? chanceCards : communityChestCards;
    const card = cards[Math.floor(Math.random() * cards.length)];
    const playerNum = gameState.currentPlayer + 1;
    const icon = type === 'chance' ? '❓' : '📦';
    const title = type === 'chance' ? 'Chance!' : 'Community Chest!';
    
    // Process card action
    switch (card.action) {
        case 'receive':
            updateBalance(gameState.currentPlayer, card.value);
            break;
        case 'pay':
            updateBalance(gameState.currentPlayer, -card.value);
            break;
        case 'moveTo':
            const player = gameState.players[gameState.currentPlayer];
            if (card.value < player.position) {
                updateBalance(gameState.currentPlayer, 200); // Passed GO
            }
            player.position = card.value;
            moveTokenToPosition(gameState.currentPlayer, card.value);
            break;
        case 'moveBack':
            const p = gameState.players[gameState.currentPlayer];
            p.position = (p.position - card.value + 40) % 40;
            moveTokenToPosition(gameState.currentPlayer, p.position);
            break;
        case 'jail':
            showModal(icon, title, card.text);
            sendToJail(gameState.currentPlayer);
            endTurn(false);
            return;
    }
    
    showModal(icon, title, card.text);
    endTurn(false);
}

function sendToJail(playerIndex) {
    const player = gameState.players[playerIndex];
    player.position = 10; // Jail position
    player.inJail = true;
    player.jailTurns = 0;
    gameState.doublesCount = 0;
    moveTokenToPosition(playerIndex, 10);
}

function updateBalance(playerIndex, amount) {
    gameState.players[playerIndex].balance += amount;
    updateBalanceDisplay();
    
    // Check for bankruptcy
    if (gameState.players[playerIndex].balance < 0) {
        gameState.gameOver = true;
        const winner = playerIndex === 0 ? 2 : 1;
        const loser = playerIndex + 1;
        
        setTimeout(() => {
            winnerTitle.textContent = `Player ${winner} Wins!`;
            winnerMessage.textContent = `Player ${loser} has gone bankrupt!`;
            gameOverModal.classList.add('show');
        }, 1000);
    }
}

function updateBalanceDisplay() {
    player1AmtEl.textContent = `$${gameState.players[0].balance}`;
    player2AmtEl.textContent = `$${gameState.players[1].balance}`;
    
    // Color code negative balances
    player1AmtEl.style.color = gameState.players[0].balance < 0 ? '#c62828' : '#1b5e20';
    player2AmtEl.style.color = gameState.players[1].balance < 0 ? '#c62828' : '#1b5e20';
}

function updateTurnIndicator() {
    if (gameState.currentPlayer === 0) {
        player1Card.classList.add('active');
        player2Card.classList.remove('active');
        gameMessageEl.textContent = "Player 1's turn - Roll the dice!";
    } else {
        player1Card.classList.remove('active');
        player2Card.classList.add('active');
        gameMessageEl.textContent = "Player 2's turn - Roll the dice!";
    }
}

function endTurn(rollAgain) {
    if (gameState.gameOver) return;
    
    if (!rollAgain) {
        gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
        gameState.doublesCount = 0;
    }
    
    updateTurnIndicator();
    rollButton.disabled = false;
}

function getSpaceName(space) {
    const nameEl = space.querySelector('.property-name, .special-name, .corner-title');
    if (nameEl) {
        return nameEl.textContent;
    }
    return space.id;
}

function showModal(icon, title, message) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
}

function restartGame() {
    // Reset game state
    gameState.players = [
        { position: 0, balance: 1500, properties: [], inJail: false, jailTurns: 0 },
        { position: 0, balance: 1500, properties: [], inJail: false, jailTurns: 0 }
    ];
    gameState.currentPlayer = 0;
    gameState.doublesCount = 0;
    gameState.gameOver = false;
    
    // Clear property ownership classes
    boardSpaces.forEach(space => {
        space.classList.remove('owned-p1', 'owned-p2');
    });
    
    // Reset UI
    updateBalanceDisplay();
    updateTurnIndicator();
    diceTotalEl.classList.remove('show');
    displayDice(dice1El, 1);
    displayDice(dice2El, 1);
    
    // Move tokens back to GO
    moveTokenToPosition(0, 0);
    moveTokenToPosition(1, 0);
    
    // Close modal
    gameOverModal.classList.remove('show');
    rollButton.disabled = false;
}