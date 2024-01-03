export enum SQUARE_STATE {
	E,
	X,
	O
}

export enum BOARD_STATE {
	PLAYING,
	X_WON,
	O_WON,
	DRAW
}

export interface IBOARD {
	state: BOARD_STATE;
	squares: SQUARE_STATE[];
}
