// Function to create the Sudoku board
function createBoard(board) {
    const boardContainer = document.getElementById('sudoku-board');
    boardContainer.innerHTML = ''; // Clear any existing board

    // Populate the board with cells
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = cell !== 0 ? cell : ''; // Populate pre-filled cells
            input.disabled = cell !== 0; // Disable pre-filled cells

            cellDiv.appendChild(input);
            boardContainer.appendChild(cellDiv);
        });
    });
}

// Function to fetch a random Sudoku puzzle from the API
async function fetchPuzzle(difficulty = 'medium') {
    try {
        const response = await fetch(`https://sudoku-api.vercel.app/api/dosuku?level=${difficulty}`);
        const data = await response.json();

        const board = data.newboard.grids[0];
        // Save the initial board state to localStorage
        localStorage.setItem('initialBoard', JSON.stringify(board.value));
        localStorage.setItem('solutionBoard', JSON.stringify(board.solution)); // Save the solution for validation
        localStorage.setItem('difficulty', board.difficulty);

        // Create the board based on fetched data
        createBoard(board.value);
    } catch (error) {
        console.error('Error fetching Sudoku puzzle:', error);
    }
}

// Function to get the current board state as a 2D array
function getBoard() {
    const board = [];
    const cells = document.querySelectorAll('.cell input');
    
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const value = cells[i * 9 + j].value;
            row.push(value ? parseInt(value) : 0);
        }
        board.push(row);
    }

    return board;
}

// Function to solve the Sudoku puzzle by validating against the saved solution
function solvePuzzle() {
    // Retrieve the saved solution board from localStorage
    const solutionBoard = JSON.parse(localStorage.getItem('solutionBoard'));
    const currentBoard = getBoard();
    const flattenedCurrentBoard = currentBoard.flat();

    // Compare the current board to the solution board
    const flattenedSolution = solutionBoard.flat();
    let isSolved = true;

    // Iterate and compare each cell
    flattenedSolution.forEach((num, index) => {
        if (num !== flattenedCurrentBoard[index]) {
            isSolved = false;
        }
    });

    // Display result to user
    if (isSolved) {
        alert('Congratulations! The puzzle is solved correctly.');
    } else {
        alert('There are some incorrect entries. Please try again.');
    }
}

// Function to reset the board to the original fetched state
function resetBoard() {
    // Retrieve the initial board state from localStorage
    const initialBoard = JSON.parse(localStorage.getItem('initialBoard'));
    createBoard(initialBoard);
}

// Helper function to split a 1D array into a 2D array
function chunkArray(array, size) {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
}

// Event Listeners
document.getElementById('solve-btn').addEventListener('click', solvePuzzle);
document.getElementById('reset-btn').addEventListener('click', resetBoard);

// Difficulty Selector Event Listener
document.getElementById('difficulty-select').addEventListener('change', (event) => {
    const difficulty = event.target.value;
    fetchPuzzle(difficulty); // Fetch a new puzzle whenever difficulty changes
});

// Fetch an initial puzzle on page load with default difficulty 'medium'
fetchPuzzle('medium');
