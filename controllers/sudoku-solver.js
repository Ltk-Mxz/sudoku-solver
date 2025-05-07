class SudokuSolver {
  // Validate puzzle string: 81 chars, only 1-9 or .
  validate(puzzle) {
    if (!puzzle) return { error: 'Required field missing' };
    if (puzzle.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (/[^1-9.]/.test(puzzle)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

  // Check if value can be placed at row,col in puzzle (row/col: 0-based)
  checkRowPlacement(puzzle, row, col, value) {
    const grid = this.createGrid(puzzle);
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzle, row, col, value) {
    const grid = this.createGrid(puzzle);
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, col, value) {
    const grid = this.createGrid(puzzle);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === value) return false;
      }
    }
    return true;
  }

  // For /api/check endpoint
  checkPlacement(puzzle, row, col, value) {
    let conflicts = [];
    if (!this.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
    if (!this.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
    if (!this.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');
    if (conflicts.length > 0) return { valid: false, conflict: conflicts };
    return { valid: true };
  }

  // Solve the puzzle, return solution string or error object
  solve(puzzle) {
    const valid = this.validate(puzzle);
    if (valid !== true) return valid;
    const grid = this.createGrid(puzzle);
    if (this.solveSudoku(grid)) {
      return grid.map(row => row.join('')).join('');
    }
    return { error: 'Puzzle cannot be solved' };
  }

  solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (this.isValid(grid, row, col, numStr)) {
              grid[row][col] = numStr;
              if (this.solveSudoku(grid)) return true;
              grid[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
      if (grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  }

  createGrid(puzzle) {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzle.slice(i * 9, (i + 1) * 9).split(''));
    }
    return grid;
  }
}

module.exports = SudokuSolver;
