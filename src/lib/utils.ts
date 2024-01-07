import {
	SQUARE_STATE,
	BOARD_STATE,
	type GAME,
	type IBOARD,
	type PARSED_GAME,
	type PLAYER
} from './types';

const winning_combinations = [
	[0, 1, 2], // top row
	[3, 4, 5], // middle row
	[6, 7, 8], // bottom row
	[0, 3, 6], // left column
	[1, 4, 7], // middle column
	[2, 5, 8], // right column
	[0, 4, 8], // left diagonal
	[2, 4, 6] // right diagonal
];

export const get_results = (squares: SQUARE_STATE[]): BOARD_STATE => {
	for (let i = 0; i < winning_combinations.length; i++) {
		const [a, b, c] = winning_combinations[i];
		if (squares[a] !== SQUARE_STATE.E && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a] as unknown as BOARD_STATE;
			// veit ekki afh unknown þarf, hefði skilið ef þyrfti í hina áttina
			// en SQUARE_STATE hefur færri state en BOARD_STATE
		} else if (squares.every((square) => square !== SQUARE_STATE.E)) {
			return BOARD_STATE.DRAW;
		}
	}
	return BOARD_STATE.PLAYING;
};

export const prep_game = (
	boards: IBOARD[],
	move: Omit<SQUARE_STATE, SQUARE_STATE.E>,
	available: number[],
	x: PLAYER,
	o: PLAYER
): GAME => {
	const state = boards
		.map((board) => board.squares.join(''))
		.join('')
		.replace(/0/g, 'e')
		.replace(/1/g, 'x')
		.replace(/2/g, 'o');
	const avail = available.join('');
	const bool_player = move === SQUARE_STATE.X;
	return {
		state,
		move: bool_player,
		score_o: o.score,
		score_x: x.score,
		user_x: x.name,
		user_o: o.name,
		available: avail
	};
};

export const parse_board = (game: GAME): PARSED_GAME => {
	const boards: IBOARD[] = [];
	for (let i = 0; i < 9; i++) {
		const squares = game.state
			.slice(i * 9, i * 9 + 9)
			.split('')
			.map((square) => {
				if (square === 'x') {
					return SQUARE_STATE.X;
				} else if (square === 'o') {
					return SQUARE_STATE.O;
				} else {
					return SQUARE_STATE.E;
				}
			});
		boards.push({ squares, state: get_results(squares) });
	}
	const available = game.available.split('').map((num) => parseInt(num, 10));
	return {
		boards,
		move: game.move ? SQUARE_STATE.X : SQUARE_STATE.O,
		available,
		x: { name: game.user_x, score: game.score_x },
		o: { name: game.user_o, score: game.score_o }
	};
};

export const new_game = (): Omit<GAME, 'user_x' | 'user_o'> => {
	return {
		state: Array(81).fill('e').join(''),
		move: true,
		score_o: 0,
		score_x: 0,
		available: '012345678'
	};
};
