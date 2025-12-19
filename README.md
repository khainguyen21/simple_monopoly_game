# Simple Monopoly Game

## Description

A modern implementation of the classic Monopoly board game using JavaScript. This project recreates the fun and excitement of Monopoly in a beautiful digital format with animations and interactive gameplay.

## Features

- **Beautiful UI** - Modern design with gradients, shadows, and color-coded properties
- **Animated Gameplay** - Dice rolling animation and step-by-step token movement
- **Full Monopoly Rules**:
  - Buy properties when landing on them
  - Pay rent to property owners (10% of property value)
  - Chance and Community Chest cards with various effects
  - Jail mechanics (roll doubles to escape or pay bail)
  - Pass GO to collect $200
  - Bankruptcy detection and game over
- **Two-Player Mode** - Take turns with a friend
- **Modal Notifications** - Beautiful popups instead of browser alerts
- **Responsive Design** - Works on desktop and mobile devices

## Technologies Used

- **JavaScript (ES6+)** - Modern syntax with Promises, Arrow Functions, Template Literals
- **HTML5** - Semantic markup with CSS Grid layout
- **CSS3** - Variables, Flexbox, Grid, Animations, Media Queries
- **Google Fonts** - Oswald and Roboto font families

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- JavaScript enabled in your browser

### Installation

1. Clone the repository

```bash
git clone https://github.com/khainguyen21/simple_monopoly_game.git
```

2. Navigate to the project directory

```bash
cd simple_monopoly_game
```

3. Open the index.html file in your web browser to start playing

## How to Play

1. Open `Lab02/index.html` in your web browser
2. Player 1 (green token) starts first
3. Click **"Roll Dice"** to roll the dice
4. Watch your token hop around the board
5. Click **"OK"** on modals to continue
6. Take turns until someone goes bankrupt
7. Click **"Play Again"** to restart

### Game Rules

- **Properties**: Automatically purchased when you land on them (if you can afford it)
- **Rent**: Pay 10% of property value when landing on opponent's property
- **Jail**: Roll doubles to escape, or pay $50 bail after 3 turns
- **Doubles**: Roll again on doubles, but 3 consecutive doubles sends you to jail
- **GO**: Collect $200 when passing or landing on GO
- **Bankruptcy**: Game ends when a player's balance goes negative

## Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Contact

- GitHub: [@khainguyen21](https://github.com/khainguyen21)

## Project Structure

```
Monopoly/
├── Lab02/
│   ├── index.html          # Main game page
│   ├── css/
│   │   └── style.css       # All styling (700+ lines)
│   ├── js/
│   │   └── lab2.js         # Game logic (540+ lines)
│   └── img/
│       ├── player1.jpg     # Player 1 avatar
│       └── player2.jpg     # Player 2 avatar
├── README.md               # This file
├── CHANGELOG.md            # Detailed change history
└── MonopolyGuide.pdf       # Original project guide
```

## Project Status

✅ **Version 2.0 Complete** - Full UI/UX overhaul with modern design and animations.

## License

This project is available for open use and modification.
