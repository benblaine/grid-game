const gridSize = 25;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(" "));
let currentPlayer = "0";
let scores = { "0": 0, "X": 0 };

// Create the grid
const gridElement = document.getElementById("grid");
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    const button = document.createElement("button");
    button.dataset.row = row;
    button.dataset.col = col;
    button.addEventListener("click", () => makeMove(row, col, button));
    gridElement.appendChild(button);
  }
}

// Handle a player's move
function makeMove(row, col, button) {
  if (grid[row][col] !== " ") return;

  // Update the grid and button
  grid[row][col] = currentPlayer;
  button.textContent = currentPlayer;
  button.disabled = true;

  // Check and fill lines
  checkAndFillLines(row, col);

  // Switch the player
  currentPlayer = currentPlayer === "0" ? "X" : "0";
  document.getElementById("info").textContent = `Player ${currentPlayer}'s turn`;
  updateScore();
}

// Check and fill horizontal and vertical lines
function checkAndFillLines(row, col) {
  fillLine(row, col, 0, 1); // Horizontal
  fillLine(row, col, 1, 0); // Vertical
}

// Fill a line in a given direction (dx, dy)
function fillLine(row, col, dx, dy) {
  const player = grid[row][col];
  let startRow = row, startCol = col, endRow = row, endCol = col;

  // Check left/up
  while (isValid(startRow - dx, startCol - dy) && grid[startRow - dx][startCol - dy] === player) {
    startRow -= dx;
    startCol -= dy;
  }

  // Check right/down
  while (isValid(endRow + dx, endCol + dy) && grid[endRow + dx][endCol + dy] === player) {
    endRow += dx;
    endCol += dy;
  }

  // Fill in the empty spaces between start and end
  if (dx === 0) {
    for (let c = startCol; c <= endCol; c++) {
      if (grid[row][c] === " ") {
        grid[row][c] = player;
        scores[player]++;
        updateButton(row, c, player);
      }
    }
  } else if (dy === 0) {
    for (let r = startRow; r <= endRow; r++) {
      if (grid[r][col] === " ") {
        grid[r][col] = player;
        scores[player]++;
        updateButton(r, col, player);
      }
    }
  }
}

// Update a button's text and disable it
function updateButton(row, col, player) {
  const buttons = document.querySelectorAll("button");
  const button = buttons[row * gridSize + col];
  button.textContent = player;
  button.disabled = true;
}

// Check if a cell is valid
function isValid(row, col) {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

// Update the score display
function updateScore() {
  document.getElementById("score").textContent = `Scores - 0: ${scores["0"]} | X: ${scores["X"]}`;
}