import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//
// Controlled Components - components who get their state from their parent class.
//
/*class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick = {() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}*/

//
// Functional Components
//

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value = {this.props.squares[i]}
        onClick = {()=> this.props.onClick(i)}
      />
    );
  }

  //
  // Method to render entire columns. Using the rowIndex and the dimension of the square the 
  // 2D index is converted to a 1D index.
  //
  renderColumns(rowIndex, squareDimension){
    const col =[];
    for(let i = 0; i < squareDimension; i++){
      col.push(this.renderSquare(squareDimension * rowIndex + i));
    }
    return(
      <div className="board-row">
        {col}
      </div>
    );
  }

  render() {
    const squareDimension = 3;
    const rows = [];
    for (let i = 0; i < squareDimension; i++){
        rows.push(this.renderColumns(i, squareDimension));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history : [{
        squares: Array(9).fill(null),
        move : Array(2).fill(null),
      }],
      xIsNext : true,
      stepNumber : 0,
    };
  }
 
  

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // Cant we have used the current itself?? Why we created squares ?? - immutability.
    const move = [parseInt(i/3) + 1, parseInt(i%3) + 1];
    
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';

    this.setState({
      history : history.concat([{
        squares : squares,
        move : move,
      }]),
      stepNumber : history.length,
      xIsNext: !this.state.xIsNext,  
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber : step,
      xIsNext : (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //showing the moves
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      const userMove = step.move[0] === null ? "" : "(" + step.move[0] + "," + step.move[1] + ")";
      return (
        <li key={move} >
          <div className="width-200px" >
            <button  onClick ={()=> this.jumpTo(move)}>{desc}</button>
            <p className = {`move-info ${move=== this.state.stepNumber? 'bold': ''}`} >{userMove}</p>
          </div>
        </li>
      )
    });

    let status;
    if(winner){
      status = 'Winner is ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i)=> this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
