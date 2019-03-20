import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.className}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const className = 'square ' + (this.props.highlightSquare === i ? 'highlightBlue' : '');
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            className={className}
        />;
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component { // highlight
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                pos: {
                    col: null,
                    row: null,
                    i:null,
                }
            }],
            xIsNext: true,
            stepNumber: 0,
            selectedStep: null,
            highlightSquare: null,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';


        this.setState({
            history: history.concat([{
                squares: squares,
                pos: {
                    col: i % 3,
                    row: Math.floor(i / 3),
                    i:i,
                }
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
        this.updateSelected(null);
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    updateSelected(step,i){
        this.setState({
            selectedStep: step,
            highlightSquare:i,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map( (step, move) => {
            const col = step.pos.col;
            const row = step.pos.row;
            const desc = move ?
                'Go to move #' + move + 'put an ' + (move % 2 !== 0 ? 'X' : 'O') +
                ' in position col: ' + col + ' row: ' + row:
                'Go to start';
            const descElement = move === this.state.selectedStep ?
                <strong>{desc}</strong> :
                desc;

            return (
                <li key={move}>
                    <button onClick={() => {this.jumpTo(move); this.updateSelected(move,step.pos.i);}}>
                        {descElement}
                    </button>
                </li>
            )
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick = {i => this.handleClick(i)}
                        highlightSquare = {this.state.highlightSquare}
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

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [6,4,2],
    ];

    for (const [a,b,c] of lines){
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
