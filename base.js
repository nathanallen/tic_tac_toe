document.addEventListener("DOMContentLoaded",function(){

  var nGames = 1;
  window.game = [];
  while(nGames--){
    window.game[nGames] = new Game(Board, Cell, nGames);  
  }

})

function Board(game, gameNumber){
  var self = this;
  var boardEl = document.createElement("div");
  this.cells = window.cells = [];

  // disable selection of board on click
  boardEl.addEventListener("click", function(){
    document.getSelection().empty()
  })

  function createCellsList(){
    for(var i=0; i<9; i++){
      self.cells.push(new Cell(game, i))
    }
  }

  var newCellElement = (function(){
    var cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    return function(){
      return cellEl.cloneNode();   
    }
  }())

  function render(){
    var cellEl;
    self.cells.forEach(function(cell,index){
      cellEl = newCellElement();
      boardEl.appendChild(cellEl);
      cell.handleClick(cellEl, index);
    });
    document.querySelector("body").appendChild(boardEl)
  }

  this.gameOver = function(status){
    self.cells.forEach(function(c){
      c.removeClick();
    })
    boardEl.classList.add(status)
    boardEl.addEventListener("click", self.reset, true)
  }

  this.reset = function(event){
    for(var i=0; i<9; i++){
      self.cells.pop();
    }
    boardEl.removeEventListener("click", self.reset, true)
    boardEl.classList.remove("win")
    boardEl.classList.remove("lose")
    boardEl.innerHTML = "";
    createCellsList();
    render();
  }

  function init(){
    createCellsList();
    render();
  }

  init.call(this);

}

function Cell(game, index){
  var self = this;
  this.symbol = null;
  this.element = null;

  function addSymbol(e){
    self.symbol = game.currentSymbol();
    e.target.innerText = self.symbol;
    e.target.classList.add("active");
    self.removeClick();
    game.checkForWinner();
  }

  this.handleClick = function(element, index){
    this.element = element;
    element.addEventListener("click", addSymbol)
  }

  this.removeClick = function(){
    this.element.removeEventListener("click", addSymbol)
  }
}

function Game(Board, Cell, gameNumber){
  var self = this;
  var symbols = ["X","0"];
  this.board = new Board(this, gameNumber);
  this.currentSymbol = function(){
    symbols.push(symbols.shift());
    return symbols[0]
  }
  this.reset = function(){
    this.board.reset();
  }

  this.checkForWinner = (function(){
    var b, status,
        cells = self.board.cells;

    function stringifyCells(){
      return cells.map(function(v){
        return v.symbol || "?";
      }).join("")
    }

    function equal(x,y,z){
      return x === y && y === z && z !== "?"
    }

    function checkRows(){
      return equal(b[0],b[1],b[2]) || equal(b[3],b[4],b[5]) || equal(b[6],b[7],b[8]);
    }

    function checkCols(){
      return equal(b[0],b[3],b[6]) || equal(b[1],b[4],b[7]) || equal(b[2],b[5],b[8]);
    }

    function checkDiags(){
     return equal(b[4],b[0],b[8]) || equal(b[4],b[2],b[6]);
    }

    function winner(status){
      self.board.gameOver(status);
    }

    return function(){
      b = stringifyCells();
      status = checkRows() || checkCols() || checkDiags();
      if(status) {
        winner("win");
      } else if (b.indexOf("?") === -1) {
        winner("lose");
      }
      return status;
    }

  }())
}
