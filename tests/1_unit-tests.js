const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

// Sample valid and invalid puzzle strings for testing
const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
// Use the correct solution from puzzle-strings.js
const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const invalidPuzzle = '1.5..2.84..63.12.7.2..5..X..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Unit Tests', () => {

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(puzzle));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.deepEqual(solver.validate(invalidPuzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5..';
    assert.deepEqual(solver.validate(shortPuzzle), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 1, '6'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    // This should be false for value '2' at (0,1) for this puzzle
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '2'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.equal(solver.solve(puzzle), solution);
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.deepEqual(solver.solve(invalidPuzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(puzzle), solution);
  });

});
