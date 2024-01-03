import { SQUARE_STATE, BOARD_STATE } from './types';

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
