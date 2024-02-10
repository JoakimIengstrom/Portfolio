function turnLeft() {
    if (!start && dir.x !== cell)
      dir = {
        x: -cell,
        y: 0,
      };
  }
  
  function turnUpp() {
    if (dir.y !== cell)
      dir = {
        x: 0,
        y: -cell,
      };
  }
  
  function turnRight() {
    if (dir.x !== -cell)
      dir = {
        x: cell,
        y: 0,
      };
  }
  
  function turnDown() {
    if (dir.y !== -cell)
      dir = {
        x: 0,
        y: cell,
      };
  }