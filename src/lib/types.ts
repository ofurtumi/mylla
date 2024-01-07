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

export interface GAME {
	state: string;
	move: boolean;
	available: string;
	score_o: number;
	score_x: number;
	user_x: string;
	user_o: string;
}

export interface DB_RESPONSE {
	success: boolean;
	id?: string;
	game?: GAME;
	error?: string;
}

export interface PLAYER {
	name: string;
	score: number;
}

export interface PARSED_GAME {
	boards: IBOARD[];
	move: Omit<SQUARE_STATE, SQUARE_STATE.E>;
	available: number[];
	x: PLAYER;
	o: PLAYER;
}
