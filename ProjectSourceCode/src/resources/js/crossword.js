
// Variables to store puzzle data
let currentPuzzle = null;
let gridData = [];
let crosswordData = {
  across: {},
  down: {}
};

// Variables to keep track of the current state
let selectedCell = null;
let currentDirection = 'across';
let currentClueNumber = null;



// Load available puzzles
async function loadPuzzles() {
  try {
    const response = await fetch('/puzzles');
    const puzzles = await response.json();
    
    const select = document.getElementById('puzzle-select');
    puzzles.forEach(puzzle => {
      const option = document.createElement('option');
      option.value = puzzle.puzzle_id;
      option.textContent = puzzle.title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading puzzles:', error);
    showMessage('Error loading puzzles. Please try again.', 'error');
  }
}

// Load selected puzzle
async function loadPuzzle(puzzleId) {
  if (!puzzleId) return;
  
  document.getElementById('loading').style.display = 'block';
  document.getElementById('crossword-container').innerHTML = '';
  document.getElementById('across-clues').innerHTML = '';
  document.getElementById('down-clues').innerHTML = '';
  
  // Make sure clues container is hidden when starting to load a new puzzle
  document.getElementById('clues-container').style.display = 'none';
  document.getElementById('crossword-container').style.display = 'none';
  document.getElementById('puzzle-controls').style.display = 'none'; // Hide controls while loading
  
  try {
    // Fetch puzzle details
    const puzzleResponse = await fetch(`/puzzles/${puzzleId}`);
    currentPuzzle = await puzzleResponse.json();
    
    // Fetch grid structure
    const gridResponse = await fetch(`/grid/${puzzleId}`);
    const gridCells = await gridResponse.json();
    
    // Convert grid cells to 2D array format
    gridData = [];
    for (let i = 0; i < currentPuzzle.rows; i++) {
      gridData[i] = [];
      for (let j = 0; j < currentPuzzle.columns; j++) {
        gridData[i][j] = ' '; // Default to empty cell
      }
    }
    
    // Fill in black cells
    gridCells.forEach(cell => {
      gridData[cell.row_index][cell.col_index] = cell.is_black ? '0' : ' ';
    });
    
    // Fetch clues
    const cluesResponse = await fetch(`/clues/${puzzleId}`);
    const clues = await cluesResponse.json();
    
    // Organize clues
    crosswordData = {
      across: {},
      down: {}
    };
    
    clues.forEach(clue => {
      crosswordData[clue.direction][clue.clue_number] = {
        answer: clue.answer,
        clue: clue.clue_text,
        startRow: clue.start_row,
        startCol: clue.start_col
      };
    });
    
    // Initialize the crossword grid
    initCrossword();
    
    // Show both containers after the puzzle is successfully loaded
    document.getElementById('clues-container').style.display = 'flex';
    document.getElementById('crossword-container').style.display = 'grid';
    document.getElementById('puzzle-controls').style.display = 'flex'; // Show controls after puzzle loads
    
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    console.error('Error loading puzzle:', error);
    showMessage('Error loading puzzle. Please try again.', 'error');
    document.getElementById('loading').style.display = 'none';
  }
}

// Initialize the crossword
function initCrossword() {
  const container = document.getElementById('crossword-container');
  container.style.gridTemplateColumns = `repeat(${currentPuzzle.columns}, 40px)`;
  
  // First pass: determine cell numbers
  let cellNumber = 1;
  const cellNumbers = {};
  
  for (let row = 0; row < gridData.length; row++) {
    for (let col = 0; col < gridData[row].length; col++) {
      if (gridData[row][col] === '0') continue;
      
      const isStartOfAcross = col === 0 || gridData[row][col-1] === '0';
      const isStartOfDown = row === 0 || gridData[row-1][col] === '0';
      
      const hasAcrossWord = isStartOfAcross && col < gridData[row].length - 1 && gridData[row][col+1] !== '0';
      const hasDownWord = isStartOfDown && row < gridData.length - 1 && gridData[row+1][col] !== '0';
      
      if (hasAcrossWord || hasDownWord) {
        cellNumbers[`${row}-${col}`] = cellNumber++;
      }
    }
  }
  
  // Second pass: create the cells with input fields
  for (let row = 0; row < gridData.length; row++) {
    for (let col = 0; col < gridData[row].length; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      
      if (gridData[row][col] === '0') {
        cell.classList.add('black');
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.dataset.row = row;
        input.dataset.col = col;
        
        input.addEventListener('focus', handleCellFocus);
        input.addEventListener('input', handleCellInput);
        input.addEventListener('keydown', handleKeyDown);
        
        cell.appendChild(input);
        
        const cellNumberKey = `${row}-${col}`;
        if (cellNumbers[cellNumberKey]) {
          const numberSpan = document.createElement('span');
          numberSpan.className = 'number';
          numberSpan.textContent = cellNumbers[cellNumberKey];
          cell.appendChild(numberSpan);
          
          // Store the clue number in the cell's dataset
          cell.dataset.number = cellNumbers[cellNumberKey];
        }
      }
      
      container.appendChild(cell);
    }
  }
  
  // Populate clues
  populateClues('across', crosswordData.across);
  populateClues('down', crosswordData.down);
  
  // Add event listeners to clues
  addCluesEventListeners();
}

function populateClues(direction, cluesData) {
  const cluesContainer = document.getElementById(`${direction}-clues`);
  
  Object.keys(cluesData).sort((a, b) => parseInt(a) - parseInt(b)).forEach(number => {
    const clueDiv = document.createElement('div');
    clueDiv.className = 'clue';
    clueDiv.dataset.number = number;
    clueDiv.dataset.direction = direction;
    clueDiv.textContent = `${number}. ${cluesData[number].clue}`;
    cluesContainer.appendChild(clueDiv);
  });
}

function addCluesEventListeners() {
  const clues = document.querySelectorAll('.clue');
  clues.forEach(clue => {
    clue.addEventListener('click', () => {
      const number = clue.dataset.number;
      const direction = clue.dataset.direction;
      
      highlightClue(number, direction);
      focusFirstCellOfClue(number, direction);
    });
  });
}

function handleCellFocus(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  
  // Find the cell that contains this input
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  
  // Determine if this cell is the start of any clue
  if (cell.dataset.number) {
    // Check if it's the start of an across clue
    const hasAcrossClue = col < gridData[row].length - 1 && gridData[row][col+1] !== '0';
    // Check if it's the start of a down clue
    const hasDownClue = row < gridData.length - 1 && gridData[row+1][col] !== '0';
    
    if (hasAcrossClue && hasDownClue) {
      // If it's both, toggle between across and down
      if (currentDirection === 'across' && currentClueNumber === cell.dataset.number) {
        currentDirection = 'down';
      } else {
        currentDirection = 'across';
      }
      currentClueNumber = cell.dataset.number;
    } else if (hasAcrossClue) {
      currentDirection = 'across';
      currentClueNumber = cell.dataset.number;
    } else if (hasDownClue) {
      currentDirection = 'down';
      currentClueNumber = cell.dataset.number;
    }
  } else {
    // If it's not the start of a clue, determine what clue it belongs to
    findClueForCell(row, col);
  }
  
  // Highlight the current clue
  if (currentClueNumber) {
    highlightClue(currentClueNumber, currentDirection);
  }
}

function findClueForCell(row, col) {
  // Find what across clue this cell belongs to
  let acrossNumber = null;
  for (let c = col; c >= 0; c--) {
    if (c < 0 || gridData[row][c] === '0') break;
    
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${c}"]`);
    if (cell && cell.dataset.number) {
      const num = cell.dataset.number;
      if (crosswordData.across[num]) {
        acrossNumber = num;
        break;
      }
    }
  }
  
  // Find what down clue this cell belongs to
  let downNumber = null;
  for (let r = row; r >= 0; r--) {
    if (r < 0 || gridData[r][col] === '0') break;
    
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${col}"]`);
    if (cell && cell.dataset.number) {
      const num = cell.dataset.number;
      if (crosswordData.down[num]) {
        downNumber = num;
        break;
      }
    }
  }
  
  // Determine current direction and clue number
  if (acrossNumber && downNumber) {
    // If cell belongs to both across and down clues, keep the current direction if possible
    if (currentDirection === 'across' && acrossNumber) {
      currentClueNumber = acrossNumber;
    } else if (currentDirection === 'down' && downNumber) {
      currentClueNumber = downNumber;
    } else {
      currentDirection = 'across'; // Default to across
      currentClueNumber = acrossNumber;
    }
  } else if (acrossNumber) {
    currentDirection = 'across';
    currentClueNumber = acrossNumber;
  } else if (downNumber) {
    currentDirection = 'down';
    currentClueNumber = downNumber;
  }
}

function highlightClue(number, direction) {
  // Remove highlighting from all clues and cells
  document.querySelectorAll('.clue').forEach(clue => clue.classList.remove('active'));
  document.querySelectorAll('.cell input').forEach(input => input.parentElement.style.backgroundColor = 'white');
  
  // Highlight the selected clue in the clue list
  const clueElement = document.querySelector(`.clue[data-number="${number}"][data-direction="${direction}"]`);
  if (clueElement) {
    clueElement.classList.add('active');
  }
  
  // Find all cells that belong to this clue and highlight them
  if (direction === 'across' && crosswordData.across[number]) {
    const startRow = crosswordData.across[number].startRow;
    const startCol = crosswordData.across[number].startCol;
    const answer = crosswordData.across[number].answer;
    
    for (let i = 0; i < answer.length; i++) {
      highlightCell(startRow, startCol + i);
    }
  } else if (direction === 'down' && crosswordData.down[number]) {
    const startRow = crosswordData.down[number].startRow;
    const startCol = crosswordData.down[number].startCol;
    const answer = crosswordData.down[number].answer;
    
    for (let i = 0; i < answer.length; i++) {
      highlightCell(startRow + i, startCol);
    }
  }
}

function highlightCell(row, col) {
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (cell) {
    cell.style.backgroundColor = '#e6f7ff';
  }
}

function focusFirstCellOfClue(number, direction) {
  let startRow, startCol;
  
  if (direction === 'across' && crosswordData.across[number]) {
    startRow = crosswordData.across[number].startRow;
    startCol = crosswordData.across[number].startCol;
  } else if (direction === 'down' && crosswordData.down[number]) {
    startRow = crosswordData.down[number].startRow;
    startCol = crosswordData.down[number].startCol;
  } else {
    return;
  }
  
  const input = document.querySelector(`input[data-row="${startRow}"][data-col="${startCol}"]`);
  if (input) {
    input.focus();
  }
  
  currentDirection = direction;
  currentClueNumber = number;
}

function handleCellInput(event) {
  if (event.target.value) {
    event.target.value = event.target.value.toUpperCase();
    
    // Move to the next cell
    moveToNextCell();
  }
}

function handleKeyDown(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  
  switch (event.key) {
    case 'ArrowRight':
      moveFocus(row, col + 1);
      event.preventDefault();
      break;
    case 'ArrowLeft':
      moveFocus(row, col - 1);
      event.preventDefault();
      break;
    case 'ArrowUp':
      moveFocus(row - 1, col);
      event.preventDefault();
      break;
    case 'ArrowDown':
      moveFocus(row + 1, col);
      event.preventDefault();
      break;
    case 'Backspace':
      if (!event.target.value) {
        // If the cell is empty, move to the previous cell
        moveToPrevCell();
        event.preventDefault();
      }
      break;
    case 'Tab':
      if (event.shiftKey) {
        // Shift+Tab: move to the previous clue
        moveToPrevClue();
      } else {
        // Tab: move to the next clue
        moveToNextClue();
      }
      event.preventDefault();
      break;
    case ' ':
      // Space: toggle direction
      toggleDirection();
      event.preventDefault();
      break;
  }
}

function moveFocus(row, col) {
  // Check if the target cell is within bounds and not a black cell
  if (row >= 0 && row < gridData.length && col >= 0 && col < gridData[row].length && gridData[row][col] !== '0') {
    const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
    if (input) {
      input.focus();
    }
  }
}

function moveToNextCell() {
  if (!selectedCell) return;
  
  const row = parseInt(selectedCell.dataset.row);
  const col = parseInt(selectedCell.dataset.col);
  
  if (currentDirection === 'across') {
    moveFocus(row, col + 1);
  } else {
    moveFocus(row + 1, col);
  }
}

function moveToPrevCell() {
  if (!selectedCell) return;
  
  const row = parseInt(selectedCell.dataset.row);
  const col = parseInt(selectedCell.dataset.col);
  
  if (currentDirection === 'across') {
    moveFocus(row, col - 1);
  } else {
    moveFocus(row - 1, col);
  }
}

function moveToNextClue() {
  const clues = Array.from(document.querySelectorAll('.clue'));
  const currentClueIndex = clues.findIndex(clue => 
    clue.dataset.number === currentClueNumber && clue.dataset.direction === currentDirection
  );
  
  if (currentClueIndex >= 0 && currentClueIndex < clues.length - 1) {
    const nextClue = clues[currentClueIndex + 1];
    highlightClue(nextClue.dataset.number, nextClue.dataset.direction);
    focusFirstCellOfClue(nextClue.dataset.number, nextClue.dataset.direction);
  }
}

function moveToPrevClue() {
  const clues = Array.from(document.querySelectorAll('.clue'));
  const currentClueIndex = clues.findIndex(clue => 
    clue.dataset.number === currentClueNumber && clue.dataset.direction === currentDirection
  );
  
  if (currentClueIndex > 0) {
    const prevClue = clues[currentClueIndex - 1];
    highlightClue(prevClue.dataset.number, prevClue.dataset.direction);
    focusFirstCellOfClue(prevClue.dataset.number, prevClue.dataset.direction);
  }
}

function toggleDirection() {
  currentDirection = currentDirection === 'across' ? 'down' : 'across';
  highlightClue(currentClueNumber, currentDirection);
}


//Checks the users inputted answers
function checkAnswers() {
  let allCorrect = true;
  const message = document.getElementById('message');
  
  // Check all cells
  for (let row = 0; row < gridData.length; row++) {
    for (let col = 0; col < gridData[row].length; col++) {
      if (gridData[row][col] === '0') continue;
      
      const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
      if (input) {
        const userValue = input.value.toUpperCase();
        const correctValue = getCellCorrectValue(row, col);
        
        if (userValue !== correctValue) {
          if (userValue !== '') {
            input.style.color = 'red';
            allCorrect = false;
          } else {
            allCorrect = false;
          }
        } else {
          input.style.color = 'green';
        }
      }
    }
  }
  
  message.style.display = 'block';
  if (allCorrect) {
    hasCompleted(currentPuzzle).then(completed => {
      if (!completed) {
        updateUserStreak();
        markComplete(currentPuzzle); // Mark it complete after updating streak
      } 
      else {
        console.log('Puzzle already completed — streak not updated.');
      }
    });

    message.textContent = 'Congratulations! All answers are correct!';
    message.style.backgroundColor = '#4CAF50';
  } 

  else {
    message.textContent = 'Some answers are incorrect. Keep trying!';
    message.style.backgroundColor = '#f44336';
  }
  
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}



//checking if the user has already completed a puzzle based on puzzle_id
async function hasCompleted(puzzle) {
  try {
    const puzzleId = puzzle.puzzle_id;
    const response = await fetch(`/has-completed?puzzleId=${puzzleId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.completed;
  } catch (error) {
    console.error('Error checking completion status:', error);
    return false; // assume not completed if there's an error
  }
}


//updates the user so they cannot get anymore points for replaying the same puzzle
async function markComplete(puzzle) {
  try {
    const puzzleId = puzzle.puzzle_id;
    const response = await fetch('/mark-completed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }


    const data = await response.json();
    if (!data.success) console.error('Failed to mark complete:', data.message);
  } catch (error) {
    console.error('Error marking puzzle complete:', error);
  }
}

//update the user wins when completing a crossword
async function updateUserStreak() {
  try {
    const response = await fetch('/update-streak', {
      method: 'POST',
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Streak updated successfully:', data.newStreak);
    } else {
      console.error('Failed to update streak:', data.message);
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}


function getCellCorrectValue(row, col) {
  // We need to find which word this cell belongs to
  for (const direction in crosswordData) {
    for (const number in crosswordData[direction]) {
      const clueData = crosswordData[direction][number];
      const answer = clueData.answer;
      const startRow = clueData.startRow;
      const startCol = clueData.startCol;
      
      if (direction === 'across') {
        const offset = col - startCol;
        if (row === startRow && offset >= 0 && offset < answer.length) {
          return answer[offset];
        }
      } else if (direction === 'down') {
        const offset = row - startRow;
        if (col === startCol && offset >= 0 && offset < answer.length) {
          return answer[offset];
        }
      }
    }
  }
  return '';
}

function revealSolution() {
  hasCompleted(currentPuzzle).then(completed => {    //if not already marked as complete mark as completed when revealed solutions
      if (!completed) {
        markComplete(currentPuzzle);
      }
  });

  for (let row = 0; row < gridData.length; row++) {
    for (let col = 0; col < gridData[row].length; col++) {
      if (gridData[row][col] === '0') continue;
      
      const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
      if (input) {
        const correctValue = getCellCorrectValue(row, col);
        input.value = correctValue;
        input.style.color = 'black';
      }
    }
  }
}

function resetPuzzle() {
  document.querySelectorAll('.cell input').forEach(input => {
    input.value = '';
    input.style.color = 'black';
  });
  
  document.querySelectorAll('.clue').forEach(clue => {
    clue.classList.remove('active');
  });
  
  document.querySelectorAll('.cell').forEach(cell => {
    cell.style.backgroundColor = 'white';
  });
  document.querySelectorAll('.cell.black').forEach(cell => {
    cell.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  });
  
  document.getElementById('message').style.display = 'none';
}

function showMessage(text, type = 'info') {
  const message = document.getElementById('message');
  message.textContent = text;
  
  switch (type) {
    case 'success':
      message.style.backgroundColor = '#4CAF50';
      break;
    case 'error':
      message.style.backgroundColor = '#f44336';
      break;
    case 'warning':
      message.style.backgroundColor = '#ff9800';
      break;
    default:
      message.style.backgroundColor = '#4a90e2';
  }
  
  message.style.display = 'block';
  
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}

// Add event listener for inputs
document.addEventListener('focusin', (event) => {
  if (event.target.tagName === 'INPUT') {
    selectedCell = event.target;
  }
});

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadPuzzles();
  
  // Make sure clues container is hidden initially
  document.getElementById('clues-container').style.display = 'none';
  document.getElementById('crossword-container').style.display = 'none';
  document.getElementById('puzzle-controls').style.display = 'none';


  
  document.getElementById('load-puzzle-button').addEventListener('click', () => {
    const puzzleId = document.getElementById('puzzle-select').value;
    if (puzzleId) {
      loadPuzzle(puzzleId);
    } else {
      showMessage('Please select a puzzle!', 'warning');
    }
  });
  
  document.getElementById('check-button').addEventListener('click', checkAnswers);
  document.getElementById('reveal-button').addEventListener('click', revealSolution);
  document.getElementById('reset-button').addEventListener('click', () => {
    resetPuzzle();
    // Also hide the clues container when resetting
    if (!currentPuzzle) {
      document.getElementById('clues-container').style.display = 'none';
      document.getElementById('puzzle-controls').style.display = 'none';
    }
  });
});