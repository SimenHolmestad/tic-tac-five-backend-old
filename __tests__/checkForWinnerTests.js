import checkForWinner, { lineSearch } from './../app/utils/checkForWinner';

describe('test line search', () => {
  it('test horizontal lines', () => {
    const board = [["X", "X", "X", "X", "X", "-"],
                   ["-", "X", "X", "X", "-", "-"],
                   ["-", "-", "-", "-", "-", "-"],
                   ["-", "-", "-", "-", "-", "-"],
                   ["-", "-", "-", "-", "-", "-"]];
    let xPos = 0;
    let yPos = 0;
    let xInterval = 1;
    let yInterval = 0;
    let player = "X";

    let matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ]);

    xPos = 5;
    yPos = 0;
    xInterval = -1;
    yInterval = 0;
    player = "X";

    matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 0, 4 ], [ 0, 3 ], [ 0, 2 ], [ 0, 1 ], [ 0, 0 ] ]);

    xPos = 1;
    yPos = 1;
    xInterval = 1;
    yInterval = 0;
    player = "X";

    matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 1, 2 ], [1, 3] ]);

    xPos = 1;
    yPos = 2;
    xInterval = 1;
    yInterval = 0;
    player = "X";

    matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ ]);

    xPos = 2;
    yPos = 0;
    xInterval = -1;
    yInterval = 0;
    player = "X";

    matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 0, 1 ], [ 0, 0 ] ]);
  });

  it('test diagonal lines', () => {
    const board = [["X", "X", "X", "X", "X", "-"],
                   ["-", "X", "X", "X", "-", "-"],
                   ["-", "-", "X", "-", "-", "-"],
                   ["-", "-", "-", "X", "-", "-"],
                   ["-", "-", "-", "-", "-", "-"]];
    let xPos = 0;
    let yPos = 0;
    let xInterval = 1;
    let yInterval = 1;
    let player = "X";

    let matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]);

    xPos = 4;
    yPos = 0;
    xInterval = -1;
    yInterval = 1;
    player = "X";

    matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 1, 3 ], [ 2, 2 ] ]);

    xPos = 1;
    yPos = 2;
    xInterval = 1;
    yInterval = -1;
    player = "X";

    matchingSquares = lineSearch(board, yPos, xPos, xInterval, yInterval, player);
    expect(matchingSquares).toEqual([ [ 1, 2 ], [ 0, 3 ] ]);
  });
});

describe('test checkForWinner', () => {
  it('test for win', () => {
    const board = [["O", "O", "O", "O", "O", "-"],
                   ["-", "O", "O", "O", "-", "-"],
                   ["-", "-", "O", "-", "-", "-"],
                   ["-", "-", "-", "O", "-", "-"],
                   ["-", "-", "-", "-", "-", "-"]];

    let winningLine = checkForWinner(board, 0, 0);
    expect(winningLine).toEqual([ [0, 0], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ]);

    winningLine = checkForWinner(board, 0, 2);
    expect(winningLine).toEqual([ [0, 0], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ]);

    let notWinningLine = checkForWinner(board, 2, 2);
    expect(notWinningLine).toEqual(null);
  });

  it('test for six in a row', () => {
    const board = [["X", "X", "X", "X", "X", "X", "-"],
                   ["-", "X", "X", "X", "-", "-", "-"],
                   ["-", "-", "X", "-", "-", "-", "-"],
                   ["-", "-", "-", "X", "-", "-", "-"],
                   ["-", "-", "-", "-", "-", "-", "-"],
                   ["-", "-", "-", "-", "-", "-", "-"]];

    let winningLine = checkForWinner(board, 0, 0);
    expect(winningLine).toEqual([ [0, 0], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ]);

    winningLine = checkForWinner(board, 0, 2);
    expect(winningLine).toEqual([ [0, 0], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ]);
  });

});
