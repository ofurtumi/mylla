<script lang="ts">
	import '../app.css';
	import Square from 'cmp/Square.svelte';
	import { BOARD_STATE, SQUARE_STATE, type IBOARD } from '$lib/types';
	import { get_results } from '$lib/utils';

	let current_player = SQUARE_STATE.X;
	let winner = BOARD_STATE.PLAYING;
	let available = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	$: current_player, get_winner(boards);

	let X = 0;
	let O = 0;

	let boards: IBOARD[] = new Array(9).fill(null).map(() => {
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
	});

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
		console.log(available);
	};

	const reset = () => {
		boards.map(() => {
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
		});
	};
</script>

<main
	class="grid grid-cols-3 grid-rows-3 aspect-square gap-2 w-full"
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
				class:pointer-events-none={!available.includes(i)}
				class:bg-gray-300={!available.includes(i)}
			>
				{#if board.state === 0}
					{#each board.squares as value, j}
						<Square
							{value}
							select={() => {
								select_square(i, j);
								get_available(j);
							}}
						/>
					{/each}
				{/if}
			</section>
		{/each}
	{:else}
		<button on:click={reset}>Nýr leikur</button>
	{/if}
</main>
