<script lang="ts">
	import '../app.css';
	import Square from 'cmp/Square.svelte';
	import { BOARD_STATE, SQUARE_STATE, type IBOARD } from '$lib/types';
	import { get_results } from '$lib/utils';

	let boards: IBOARD[];
	let current_player = SQUARE_STATE.X;
	let winner: BOARD_STATE;
	let available: number[];

	let X = 0;
	let O = 0;

	const empty_board = () => {
		return {
			state: BOARD_STATE.PLAYING,
			squares: [
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E,
				SQUARE_STATE.E
			]
		};
	};

	const reset = () => {
		boards = new Array(9).fill(null).map(empty_board);
		winner = BOARD_STATE.PLAYING;
		available = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	};

	const get_winner = (boards: IBOARD[]) => {
		boards.forEach((board) => {
			board.state = get_results(board.squares);
		});

		if (boards.filter((board) => board.state !== BOARD_STATE.PLAYING).length >= 3) {
			winner = get_results(
				boards.map(
					(board) =>
						(board.state === BOARD_STATE.DRAW
							? BOARD_STATE.PLAYING
							: board.state) as unknown as SQUARE_STATE
				)
			);

			if (winner === BOARD_STATE.X_WON) X++;
			else if (winner === BOARD_STATE.O_WON) O++;
		}
	};

	const select_square = (board: number, square: number) => {
		boards[board].squares[square] = current_player;
		current_player = Math.abs(current_player - 3) as SQUARE_STATE;
	};

	const get_available = (square: number) => {
		if (boards[square].state !== BOARD_STATE.PLAYING) {
			available = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // all available
			return;
		}
		available = [square];
	};

	reset();
</script>

<header class="flex justify-between p-2">
	<h1>OFURMYLLA</h1>
	<button
		class="border border-black p-2 text-lg"
		class:hidden={winner === BOARD_STATE.PLAYING}
		on:click={reset}>Nýr leikur</button
	>
</header>

<main
	class="grid grid-cols-3 grid-rows-3 aspect-square gap-2 w-full max-w-3xl mx-auto"
	class:x-square={winner === BOARD_STATE.X_WON}
	class:o-square={winner === BOARD_STATE.O_WON}
	class:draw-square={winner === BOARD_STATE.DRAW}
>
	{#if winner === BOARD_STATE.PLAYING}
		{#each boards as board, i}
			<section
				class="grid grid-cols-3 grid-rows-3 gap-1 place-items-center rounded-lg p-2 game"
				class:x-square={board.state === BOARD_STATE.X_WON}
				class:o-square={board.state === BOARD_STATE.O_WON}
				class:draw-square={board.state === BOARD_STATE.DRAW}
				class:pointer-events-none={!available.includes(i)}
				class:bg-gray-300={!available.includes(i)}
			>
				{#if board.state === 0}
					{#each board.squares as value, j}
						<Square
							{value}
							select={() => {
								select_square(i, j);
								get_winner(boards);
								get_available(j);
							}}
						/>
					{/each}
				{/if}
			</section>
		{/each}
	{/if}
</main>

<footer class="p-2">
	<h1 class="text-center border-b border-black text-lg">
		{current_player === SQUARE_STATE.X ? 'X' : 'O'} á leik
	</h1>
	<div class="flex justify-center gap-4 items-center">
		<h2>Staðan</h2>
		<div>
			<h3>X: {X} stig</h3>
			<h3>O: {O} stig</h3>
		</div>
	</div>
</footer>
