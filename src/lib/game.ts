import { Icon, type Game, State } from './types';

const win_states = [
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 4, 8],
	[2, 4, 6]
];

export const get_winner = (board: Icon[]): Pick<Game, 'state' | 'squares' | 'winner'> => {
	for (let i = 0; i < win_states.length; i++) {
		const [a, b, c] = win_states[i];
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return { state: State.won, squares: [a, b, c], winner: a };
		}
	}

	// If there are empty spaces, the game is incomplete.
	console.log(board);
	if (board.includes(Icon.none)) {
		console.log('hér');
		return { state: State.going };
	}
	// If there are no empty spaces, it's a tie.
	else return { state: State.tie };
};
