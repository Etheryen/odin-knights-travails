'use strict';

function getBoard() {
  const result = [];
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      result.push({ x, y });
    }
  }

  return result;
}
const BOARD = getBoard();

function isMoveLegit(from, to) {
  const xDiff = Math.abs(from.x - to.x);
  const yDiff = Math.abs(from.y - to.y);

  if (xDiff === 1 && yDiff === 2) return true;
  if (xDiff === 2 && yDiff === 1) return true;

  return false;
}

function getMovesFromSquare(startingSquare, depth = 1) {
  const moves = BOARD.filter((nextSquare) =>
    isMoveLegit(startingSquare, nextSquare)
  );
  if (depth > 1)
    return moves.map((nextSquare) => getMovesFromSquare(nextSquare, depth - 1));

  return moves;
}
function isMoveSame(move1, move2) {
  if (move1.x === move2.x && move1.y === move2.y) return true;
  return false;
}

function checkIfMoveInArray(move, array) {
  for (const moveToCheck of array) {
    if (isMoveSame(move, moveToCheck)) return true;
  }
  return false;
}

function findDepthOfMove(start, end) {
  let depthFound = false;
  let depth = 1;
  let currentMoves = getMovesFromSquare(start, depth);

  while (!depthFound) {
    for (const nextMove of currentMoves) {
      if (checkIfMoveInArray(end, currentMoves.flat(Infinity))) {
        depthFound = true;
      }
    }
    currentMoves = getMovesFromSquare(start, ++depth);
  }

  return --depth;
}

function findPathByDepth(start, end, depth, path = [start]) {
  let currentMoves = getMovesFromSquare(path.at(-1));
  if (checkIfMoveInArray(end, currentMoves)) return path.concat(end);

  for (const square of currentMoves) {
    let deepMoves = getMovesFromSquare(square, depth - 1).flat(Infinity);

    if (checkIfMoveInArray(end, deepMoves)) {
      return findPathByDepth(start, end, depth - 1, path.concat(square));
    }
  }
}

function pathToNiceOutput(path) {
  let result = `=> You made it in ${path.length - 1} move${
    path.length > 2 ? 's' : ''
  }!  Here's your path:`;

  for (const move of path) {
    result += `\n  [${move.x},${move.y}]`;
  }

  return result;
}

function pathTo2dArray(path) {
  const result = [];

  for (const move of path) {
    result.push([move.x, move.y]);
  }

  return result;
}

function knightMoves(startArr, endArr, returnArray = false) {
  const start = { x: startArr[0], y: startArr[1] };
  const end = { x: endArr[0], y: endArr[1] };

  const path = findPathByDepth(start, end, findDepthOfMove(start, end));

  if (returnArray) return pathTo2dArray(path);
  return pathToNiceOutput(path);
}

console.log(knightMoves([0, 0], [1, 2])); // [ [ 0, 0 ], [ 1, 2 ] ]
console.log(knightMoves([0, 0], [3, 3])); // [ [ 0, 0 ], [ 1, 2 ], [ 3, 3 ] ]
console.log(knightMoves([3, 3], [0, 0])); // [ [ 3, 3 ], [ 1, 2 ], [ 0, 0 ] ]
console.log(knightMoves([3, 3], [4, 3])); // [ [ 3, 3 ], [ 1, 2 ], [ 2, 4 ], [ 4, 3 ] ]
