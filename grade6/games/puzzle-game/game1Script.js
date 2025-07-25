document.addEventListener('DOMContentLoaded', () => {
    const loginPage = document.getElementById('loginPage');
    const gamePage = document.getElementById('gamePage');
    const gameOverPage = document.getElementById('gameOverPage');

    const playerNameInput = document.getElementById('playerName');
    const startGameBtn = document.getElementById('startGameBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const countdownTimerDisplay = document.getElementById('countdownTimer');
    const userRankDisplay = document.getElementById('userRank');
    const wordGridElement = document.getElementById('wordGrid');
    const wordsToFindElement = document.getElementById('wordsToFind');
    const wordsFoundCountFinal = document.getElementById('wordsFoundCountFinal');
    const timeTakenFinal = document.getElementById('timeTakenFinal');
    const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');

    let playerName = '';
    let foundWordsCount = 0;
    let timerInterval;
    let gameTimeElapsed = 0; // In seconds
    let puzzleWords = []; // The 10 words for the current game
    let puzzleGrid = []; // 2D array representing the letter grid
    let gridRows = 10;
    let gridCols = 10;
    let selectedLetters = []; // Stores objects { row, col, char, element }
    let isMouseDown = false;
    let foundWords = new Set(); // To keep track of found words

    const allPossibleWords = [
        "APPLE", "BAKER", "CANDY", "DREAM", "EAGLE", "FANCY", "GRAPE", "HAPPY", "IDEAL", "JOLLY",
        "KINDY", "LEMON", "MIXED", "NIGHT", "OCEAN", "PEACH", "QUEEN", "RIVER", "SUNNY", "TIGER",
        "UNION", "VALUE", "WHITE", "XYLON", "YACHT", "ZEBRA", "BRAVE", "CRISP", "DAISY", "FROST"
    ];

    // --- Utility Functions ---
    function getRandomChar() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Game Logic ---

    function initializeGame() {
        foundWordsCount = 0;
        gameTimeElapsed = 0;
        foundWords.clear();
        selectedLetters = [];
        isMouseDown = false;

        // Reset UI
        countdownTimerDisplay.textContent = '10:00';
        wordsToFindElement.innerHTML = '';
        wordGridElement.innerHTML = '';
        userRankDisplay.textContent = '--/--';
        document.getElementById('userAvatar').src = 'https://via.placeholder.com/40'; // Reset avatar
        userNameDisplay.textContent = playerName;

        // Select 10 random words for the puzzle
        shuffleArray(allPossibleWords);
        puzzleWords = allPossibleWords.slice(0, 10);
        puzzleWords.sort(); // Optional: sort alphabetically for consistency

        createWordGrid();
        placeWordsInGrid();
        fillEmptyCells();
        renderWordGrid();
        renderWordsToFind();
        startCountdown();

        // Simulate initial rank (will be updated by Firebase)
        userRankDisplay.textContent = `1/1`;
    }

    function createWordGrid() {
        wordGridElement.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        wordGridElement.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
        puzzleGrid = Array(gridRows).fill(null).map(() => Array(gridCols).fill(''));
    }

    function placeWordsInGrid() {
        puzzleWords.forEach(word => {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                const direction = Math.floor(Math.random() * 4); // 0: H, 1: V, 2: DiagDown, 3: DiagUp
                const startRow = Math.floor(Math.random() * gridRows);
                const startCol = Math.floor(Math.random() * gridCols);

                let canPlace = true;
                let cellsToOccupy = [];

                for (let i = 0; i < word.length; i++) {
                    let r = startRow;
                    let c = startCol;

                    if (direction === 0) c += i; // Horizontal
                    else if (direction === 1) r += i; // Vertical
                    else if (direction === 2) { r += i; c += i; } // Diagonal Down-Right
                    else if (direction === 3) { r -= i; c += i; } // Diagonal Up-Right

                    if (r < 0 || r >= gridRows || c < 0 || c >= gridCols) {
                        canPlace = false;
                        break;
                    }

                    if (puzzleGrid[r][c] !== '' && puzzleGrid[r][c] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                    cellsToOccupy.push({ r, c, char: word[i] });
                }

                if (canPlace) {
                    cellsToOccupy.forEach(cell => {
                        puzzleGrid[cell.r][cell.c] = cell.char;
                    });
                    placed = true;
                }
                attempts++;
            }
            if (!placed) {
                console.warn(`Could not place word: ${word}. Consider adjusting grid size or words.`);
            }
        });
    }

    function fillEmptyCells() {
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                if (puzzleGrid[r][c] === '') {
                    puzzleGrid[r][c] = getRandomChar();
                }
            }
        }
    }

    function renderWordGrid() {
        wordGridElement.innerHTML = '';
        puzzleGrid.forEach((row, rIdx) => {
            row.forEach((char, cIdx) => {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = rIdx;
                cell.dataset.col = cIdx;
                cell.textContent = char;
                wordGridElement.appendChild(cell);

                cell.addEventListener('mousedown', startSelection);
                cell.addEventListener('mouseenter', continueSelection);
                cell.addEventListener('mouseup', endSelection);
            });
        });
    }

    function renderWordsToFind() {
        wordsToFindElement.innerHTML = '';
        puzzleWords.forEach(word => {
            const wordTile = document.createElement('div');
            wordTile.classList.add('word-tile');
            wordTile.dataset.word = word;
            wordTile.textContent = word;
            wordsToFindElement.appendChild(wordTile);
        });
    }

    function startCountdown() {
        let timeLeft = 10 * 60; // 10 minutes in seconds

        clearInterval(timerInterval); // Clear any existing timer
        timerInterval = setInterval(() => {
            timeLeft--;
            gameTimeElapsed++;

            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;

            countdownTimerDisplay.textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval);
        gamePage.classList.add('d-none');
        gameOverPage.classList.remove('d-none');
        wordsFoundCountFinal.textContent = foundWordsCount;

        const finalMinutes = Math.floor(gameTimeElapsed / 60);
        const finalSeconds = gameTimeElapsed % 60;
        timeTakenFinal.textContent = `${finalMinutes.toString().padStart(2, '0')}:${finalSeconds.toString().padStart(2, '0')}`;

        // TODO: Here you would send data to Firebase
        console.log(`Game Over! Player: ${playerName}, Words Found: ${foundWordsCount}, Time: ${gameTimeElapsed}s`);
    }

    // --- Selection Logic ---
    function startSelection(event) {
        if (foundWords.size === puzzleWords.length) return; // Game already won
        isMouseDown = true;
        clearSelection();
        const cell = event.target;
        cell.classList.add('selected');
        selectedLetters.push({
            row: parseInt(cell.dataset.row),
            col: parseInt(cell.dataset.col),
            char: cell.textContent,
            element: cell
        });
    }

    function continueSelection(event) {
        if (!isMouseDown || foundWords.size === puzzleWords.length) return;
        const cell = event.target;
        if (!cell.classList.contains('grid-cell')) return;

        const newRow = parseInt(cell.dataset.row);
        const newCol = parseInt(cell.dataset.col);

        // Prevent selecting the same cell twice in a row
        if (selectedLetters.length > 0) {
            const lastSelected = selectedLetters[selectedLetters.length - 1];
            if (lastSelected.row === newRow && lastSelected.col === newCol) {
                return;
            }

            // Ensure contiguous selection (horizontal, vertical, or diagonal)
            const prevRow = lastSelected.row;
            const prevCol = lastSelected.col;

            const rowDiff = Math.abs(newRow - prevRow);
            const colDiff = Math.abs(newCol - prevCol);

            if (!((rowDiff <= 1 && colDiff === 0) || // Vertical
                  (rowDiff === 0 && colDiff <= 1) || // Horizontal
                  (rowDiff <= 1 && colDiff <= 1 && rowDiff === colDiff))) { // Diagonal
                // If the new cell is not adjacent, clear selection and start new one
                clearSelection();
                isMouseDown = true; // Keep mousedown active
                cell.classList.add('selected');
                selectedLetters.push({
                    row: newRow,
                    col: newCol,
                    char: cell.textContent,
                    element: cell
                });
                return;
            }
        }

        // Add to selection if not already selected
        const isAlreadySelected = selectedLetters.some(s => s.row === newRow && s.col === newCol);
        if (!isAlreadySelected) {
            cell.classList.add('selected');
            selectedLetters.push({
                row: newRow,
                col: newCol,
                char: cell.textContent,
                element: cell
            });
        }
    }

    function endSelection() {
        isMouseDown = false;
        checkSelectedWord();
        clearSelection(); // Clear visual selection, not the word itself
    }

    function clearSelection() {
        selectedLetters.forEach(s => s.element.classList.remove('selected'));
        selectedLetters = [];
    }

    function checkSelectedWord() {
        if (selectedLetters.length < 2) return; // Need at least 2 letters for a word

        const selectedWord = selectedLetters.map(s => s.char).join('');
        const reversedWord = selectedLetters.map(s => s.char).join('').split('').reverse().join('');

        const foundInPuzzleWords = puzzleWords.includes(selectedWord);
        const foundReversedInPuzzleWords = puzzleWords.includes(reversedWord);

        let wordFoundInThisSelection = false;
        let foundMatch = '';

        if (foundInPuzzleWords && !foundWords.has(selectedWord)) {
            foundMatch = selectedWord;
            wordFoundInThisSelection = true;
        } else if (foundReversedInPuzzleWords && !foundWords.has(reversedWord)) {
            foundMatch = reversedWord;
            wordFoundInThisSelection = true;
        }

        if (wordFoundInThisSelection) {
            foundWords.add(foundMatch);
            foundWordsCount = foundWords.size;

            // Mark letters as found
            selectedLetters.forEach(s => {
                s.element.classList.add('found');
                s.element.classList.remove('selected'); // Remove selected class if it was still there
            });

            // Mark word tile as found
            const wordTile = document.querySelector(`.word-tile[data-word="${foundMatch}"]`);
            if (wordTile) {
                wordTile.classList.add('found');
            }

            console.log(`Found word: ${foundMatch}! Total found: ${foundWordsCount}`);

            // TODO: Update user's rank in Firebase here based on wordsFoundCount and gameTimeElapsed
            // For now, a placeholder:
            userRankDisplay.textContent = `${foundWordsCount}/10`;


            if (foundWordsCount === puzzleWords.length) {
                // All words found, end game early
                clearInterval(timerInterval);
                setTimeout(() => {
                    endGame();
                }, 500); // Give a brief moment for final highlights
            }
        }
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        if (playerName) {
            loginPage.classList.add('d-none');
            gamePage.classList.remove('d-none');
            initializeGame();
        } else {
            alert('Please enter your name to start the game!');
        }
    });

    viewLeaderboardBtn.addEventListener('click', () => {
        // TODO: Implement actual leaderboard display (from Firebase)
        alert("Leaderboard functionality coming soon! (Integrate with Firebase)");
        // For now, let's just allow playing again
        gameOverPage.classList.add('d-none');
        loginPage.classList.remove('d-none');
    });

    playAgainBtn.addEventListener('click', () => {
        gameOverPage.classList.add('d-none');
        loginPage.classList.remove('d-none');
        playerNameInput.value = ''; // Clear name input for new player or new session
    });

    // Handle mouse up anywhere on the document to ensure selection ends
    document.addEventListener('mouseup', () => {
        if (isMouseDown) {
            endSelection();
        }
    });
});