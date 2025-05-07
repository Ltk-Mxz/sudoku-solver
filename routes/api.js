'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate value
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Validate coordinate
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Validate puzzle string
      const valid = solver.validate(puzzle);
      if (valid !== true) {
        return res.json(valid);
      }

      // Convert coordinate to row/col
      const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate[1], 10) - 1;

      // If value is already at that position, valid if not conflicting
      if (puzzle[row * 9 + col] === value) {
        return res.json({ valid: true });
      }

      // Check placement
      const result = solver.checkPlacement(puzzle, row, col, value);
      return res.json(result);
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // Required field
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // Validate puzzle string
      const valid = solver.validate(puzzle);
      if (valid !== true) {
        return res.json(valid);
      }

      const solution = solver.solve(puzzle);
      // If solution is a string of all 9's, treat as unsolvable
      if (solution === '9'.repeat(81)) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      if (solution && typeof solution === 'object' && solution.error) {
        return res.json(solution);
      }
      return res.json({ solution });
    });
};
