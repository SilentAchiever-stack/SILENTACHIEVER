// Memory Game - Complete implementation in JavaScript only
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;

        // Card symbols (emojis for visual appeal)
        this.symbols = ['🎮', '🎯', '🎨', '🎪', '🎭', '🎸', '🎺', '🎻', '🎲', '🎳', '🏆', '🏅', '⚽', '🏀', '🎾', '🏐'];

        this.init();
    }

    init() {
        this.createHTML();
        this.createCSS();
        this.setupEventListeners();
        this.createBoard();
    }

    createHTML() {
        // Clear existing content
        document.body.innerHTML = '';

        // Create main container
        const container = document.createElement('div');
        container.className = 'game-container';

        // Create header
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <h1>🧠 Memory Game</h1>
            <div class="game-stats">
                <div class="stat">
                    <span class="stat-label">Time:</span>
                    <span id="timer">00:00</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Moves:</span>
                    <span id="moves">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Pairs:</span>
                    <span id="pairs">0/8</span>
                </div>
            </div>
            <div class="game-controls">
                <button id="newGame" class="btn">New Game</button>
                <select id="difficulty" class="difficulty-select">
                    <option value="easy">Easy (4x4)</option>
                    <option value="medium">Medium (4x6)</option>
                    <option value="hard">Hard (6x6)</option>
                </select>
            </div>
        `;

        // Create game board
        const gameBoard = document.createElement('div');
        gameBoard.id = 'gameBoard';
        gameBoard.className = 'game-board';

        // Create win modal
        const modal = document.createElement('div');
        modal.id = 'winModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Congratulations!</h2>
                <p id="winMessage">You won!</p>
                <div class="modal-stats">
                    <div>Time: <span id="finalTime"></span></div>
                    <div>Moves: <span id="finalMoves"></span></div>
                </div>
                <button id="playAgain" class="btn">Play Again</button>
            </div>
        `;

        container.appendChild(header);
        container.appendChild(gameBoard);
        container.appendChild(modal);
        document.body.appendChild(container);
    }

    createCSS() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .game-container {
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                max-width: 800px;
                width: 100%;
            }
            
            .game-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .game-header h1 {
                color: #2c3e50;
                font-size: 2.5rem;
                margin-bottom: 20px;
            }
            
            .game-stats {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .stat {
                background: #f8f9fa;
                padding: 10px 20px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
            
            .stat-label {
                font-weight: 600;
                color: #2c3e50;
            }
            
            .game-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .btn {
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .btn:hover {
                background: #5a67d8;
                transform: translateY(-2px);
            }
            
            .difficulty-select {
                padding: 12px 16px;
                border: 2px solid #e0e6ed;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                cursor: pointer;
            }
            
            .game-board {
                display: grid;
                gap: 15px;
                justify-content: center;
                margin: 30px 0;
                transition: all 0.3s ease;
            }
            
            .game-board.easy {
                grid-template-columns: repeat(4, 1fr);
                max-width: 400px;
                margin: 30px auto;
            }
            
            .game-board.medium {
                grid-template-columns: repeat(4, 1fr);
                max-width: 400px;
                margin: 30px auto;
            }
            
            .game-board.hard {
                grid-template-columns: repeat(6, 1fr);
                max-width: 600px;
                margin: 30px auto;
            }
            
            .card {
                aspect-ratio: 1;
                background: #34495e;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: transparent;
                transition: all 0.6s ease;
                transform-style: preserve-3d;
                position: relative;
                min-height: 80px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .card:hover {
                transform: scale(1.05);
            }
            
            .card.flipped {
                background: #ecf0f1;
                color: #2c3e50;
                transform: rotateY(180deg);
            }
            
            .card.matched {
                background: #2ecc71;
                color: white;
                cursor: default;
                animation: matchPulse 0.6s ease;
            }
            
            .card.wrong {
                background: #e74c3c;
                animation: shake 0.5s ease;
            }
            
            @keyframes matchPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }
            
            .modal.show {
                display: flex;
            }
            
            .modal-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-content h2 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 2rem;
            }
            
            .modal-content p {
                color: #7f8c8d;
                margin-bottom: 20px;
                font-size: 1.1rem;
            }
            
            .modal-stats {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            
            .modal-stats div {
                margin: 5px 0;
                font-weight: 600;
                color: #2c3e50;
            }
            
            @media (max-width: 600px) {
                .game-container {
                    padding: 20px;
                }
                
                .game-header h1 {
                    font-size: 2rem;
                }
                
                .game-stats {
                    gap: 15px;
                }
                
                .card {
                    font-size: 1.5rem;
                    min-height: 60px;
                }
                
                .game-board.hard {
                    grid-template-columns: repeat(4, 1fr);
                    max-width: 400px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('difficulty').addEventListener('change', () => this.newGame());
        document.getElementById('playAgain').addEventListener('click', () => {
            this.hideModal();
            this.newGame();
        });
    }

    getDifficultySettings() {
        const difficulty = document.getElementById('difficulty').value;
        switch (difficulty) {
            case 'easy':
                return { pairs: 8, columns: 4, rows: 4 };
            case 'medium':
                return { pairs: 12, columns: 4, rows: 6 };
            case 'hard':
                return { pairs: 18, columns: 6, rows: 6 };
            default:
                return { pairs: 8, columns: 4, rows: 4 };
        }
    }

    createBoard() {
        const settings = this.getDifficultySettings();
        const gameBoard = document.getElementById('gameBoard');
        const difficulty = document.getElementById('difficulty').value;

        // Clear existing board
        gameBoard.innerHTML = '';
        gameBoard.className = `game-board ${difficulty}`;

        // Create card pairs
        const cardSymbols = [];
        for (let i = 0; i < settings.pairs; i++) {
            cardSymbols.push(this.symbols[i], this.symbols[i]);
        }

        // Shuffle cards
        this.shuffleArray(cardSymbols);

        // Create card elements
        this.cards = [];
        cardSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.addEventListener('click', () => this.flipCard(card));

            gameBoard.appendChild(card);
            this.cards.push(card);
        });

        // Update pairs display
        document.getElementById('pairs').textContent = `0/${settings.pairs}`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    flipCard(card) {
        // Don't flip if game hasn't started, card is already flipped, or we have 2 cards flipped
        if (!this.gameStarted && this.timer === 0) {
            this.startTimer();
            this.gameStarted = true;
        }

        if (card.classList.contains('flipped') ||
            card.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }

        // Flip the card
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        this.flippedCards.push(card);

        // Check for match when 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;

            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');

            this.matchedPairs++;
            const settings = this.getDifficultySettings();
            document.getElementById('pairs').textContent = `${this.matchedPairs}/${settings.pairs}`;

            // Check if game is won
            if (this.matchedPairs === settings.pairs) {
                this.gameWon();
            }
        } else {
            // No match
            card1.classList.add('wrong');
            card2.classList.add('wrong');

            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong');
                card2.classList.remove('flipped', 'wrong');
                card1.textContent = '';
                card2.textContent = '';
            }, 500);
        }

        this.flippedCards = [];
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            document.getElementById('timer').textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    gameWon() {
        this.stopTimer();
        this.gameStarted = false;

        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('finalTime').textContent = timeString;
        document.getElementById('finalMoves').textContent = this.moves;

        // Show win message based on performance
        let message = 'Great job!';
        if (this.moves <= this.matchedPairs * 1.5) {
            message = 'Excellent memory! 🧠';
        } else if (this.moves <= this.matchedPairs * 2) {
            message = 'Well done! 👏';
        } else {
            message = 'Good effort! Keep practicing! 💪';
        }

        document.getElementById('winMessage').textContent = message;
        this.showModal();
    }

    showModal() {
        document.getElementById('winModal').classList.add('show');
    }

    hideModal() {
        document.getElementById('winModal').classList.remove('show');
    }

    newGame() {
        this.stopTimer();
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = 0;
        this.gameStarted = false;

        // Reset displays
        document.getElementById('timer').textContent = '00:00';
        document.getElementById('moves').textContent = '0';

        this.createBoard();
        this.hideModal();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

// If running in Node.js environment, export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryGame;
}