/* eslint-disable react/no-multi-comp, no-magic-numbers */
import React from 'react';
import ReactDOM from 'react-dom';

class Square extends React.Component {
	render() {
		return (
			<button
				className="square"
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</button>
		);
	}
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				onClick={() => this.props.onClick(i)}
				value={this.props.squares[i]}
			/>
		);
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

class Game extends React.Component {
	constructor() {
		super();
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			xIsNext: true,
			stepNumber: 0,
		};
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
		});
	}

	handleClick(i) {
		const history = this.state.history;
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (calculateState(squares) || squares[i])
			return;

		squares[i] = this.state.xIsNext ? 'X' : 'O';

		this.setState({
			history: history.concat([{
				squares,
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const game = calculateState(current.squares);
		let status;

		if (game) {
			switch (game.state) {
				case 'win':
					status = `Winner: ${game.player}`;
					break;
				case 'draw':
					status = 'Draw!';
					break;
				default:
					status = 'Unknown Game State';
					break;
			}
		} else {
			status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
		}

		const moves = history.map((step, move) => {
			const desc = move ? `Move # ${move}` : 'Game Start';

			return (
				<li key={move}>
					<a
						href="#"
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</a>
				</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board
						onClick={i => this.handleClick(i)}
						squares={current.squares}
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

ReactDOM.render(
	<Game />,
	document.getElementById('container')
);

function calculateState(squares) {
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

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];

		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				state: 'win',
				player: squares[a],
			};
		}
	}

	let draw = true;

	for (const position of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
		if (!squares[position])
			draw = false;
	}

	if (draw) {
		return {
			state: 'draw',
		};
	}

	return null;
}

