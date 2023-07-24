export enum State {
	won = 1,
	tie = 2,
	going = 3
}

export type Winner = {
	winner?: Icon;
	kind?: [number, number, number];
};

export type WinState = Omit<Icon, Icon.none>[];

export interface Game {
	board: Icon[];
	current: Icon;
	switch: () => void;
	state: State;
	squares?: WinState;
	winner?: Icon;
}

export enum Icon {
	none = 0,
	x = 1,
	o = 2
}
