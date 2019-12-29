export function lineSearch(board, xPos, yPos, xInterval, yInterval, player) {
  // Search in a line and returns coordinates of tiles in a row matching the player
  // string. Note: The starting tile is not included.
  const matchingTiles = [];
  let currentX = xPos;
  let currentY = yPos;
  for (var i = 0; i < 5; i++) {
    currentX += xInterval;
    currentY += yInterval;
    if (currentY < 0 || currentY > 20 || currentX < 0 || currentX > 20) {
      break; // Outside of board
    }
    if (board[currentY][currentX] == player) {
      matchingTiles.push([currentY, currentX]);
    } else {
      break;
    }
  }
  return matchingTiles;

}

function checkForWinner(board, xPos, yPos) {
  // Checks if the move specified is a winning move. If this is the case, an array of
  // the moves in the winning line is returned. If there is no winner, null is
  // returned.

  const player = board[yPos][xPos];
  const startTile = [yPos, xPos];

  const directionsToCheck = [ [1, 0], [0, 1], [1, 1], [1, -1] ];

  for (const direction of directionsToCheck) {
    // Search in both ways to find tiles "in a row".
    const tilesInDirection = lineSearch(board, xPos, yPos, direction[1], direction[0], player);
    const tilesInOppositeDirection = lineSearch(board, xPos, yPos, -direction[1], -direction[0], player);
    const totalTiles = [startTile, ...tilesInDirection, ...tilesInOppositeDirection];

    // Check if there are 5 or more tiles in a row
    if (totalTiles.length >= 5) {
      // Sort tiles first by y-coordinate and then x-coordinate
      totalTiles.sort(function (a, b) {
        return a[0] - b[0];
      });
      totalTiles.sort(function (a, b) {
        return a[1] - b[1];
      });

      // Make sure only 5 tiles are returned
      const fiveInARow = totalTiles.slice(0, 5);
      return fiveInARow;
    }
  }
  return null;
}


export default checkForWinner;
