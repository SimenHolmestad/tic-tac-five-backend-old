function boardToString(board) {
  let gameString = "";
  for (const xArray of board) {
    gameString += xArray.join(" ");
    gameString += "\n";
  }
  return gameString;
}

export default boardToString;
