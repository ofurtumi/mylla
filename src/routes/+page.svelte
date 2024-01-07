<script lang="ts">
	import '../app.css';
	import { set_game, create_game, unsub, get_game, add_o_user, reset_game } from '$lib/db';
	import Square from 'cmp/Square.svelte';
	import { BOARD_STATE, SQUARE_STATE, type IBOARD, type DB_RESPONSE } from '$lib/types';
	import { get_results, prep_game, parse_board } from '$lib/utils';

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
		if (game_id) {
			reset_game(game_id);
		}
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

	let game_id: string;
	let this_user: string;
	let x_username: string;
	let o_username: string;

	const send_game = () => {
		const prepped_game = {
			...prep_game(
				boards,
				current_player,
				available,
				{ name: x_username, score: X },
				{ name: o_username, score: O }
			)
		};
		set_game(prepped_game, game_id);
	};

	const make_game = async () => {
		if (!this_user) {
			alert('Vinsamlegast skráðu notendanafn');
			return;
		}

		const new_game = await create_game({
			...prep_game(
				boards,
				current_player,
				available,
				{ name: this_user, score: X },
				{ name: '', score: O }
			)
		});

		if (new_game && new_game.id) {
			game_id = new_game.id;
			unsub(game_id, refresh);
		}
	};

	const join_game = async () => {
		if (!this_user) {
			alert('Vinsamlegast skráðu notendanafn');
			return;
		}
		if (!game_id) {
			alert('Vinsamlegast skráðu leik');
			return;
		}
		const response = await get_game(game_id);

		if (!response.success || !response.game?.user_x) {
			alert('Leikur fannst ekki');
			return;
		} else if (response.game?.user_o) {
			alert('Leikur er tekinn');
			return;
		}

		add_o_user(game_id, this_user);
		if (response && response.id) {
			x_username = response.game?.user_x ?? '';
			o_username = this_user;
			game_id = response.id;
			unsub(game_id, refresh);
		}
	};

	const refresh = (game: DB_RESPONSE) => {
		if (game.success && game.game) {
			const parsed_game = parse_board(game.game);
			boards = parsed_game.boards;
			current_player = parsed_game.move as SQUARE_STATE;
			available = parsed_game.available;
			if (parsed_game.x.score !== X || parsed_game.o.score !== O) {
				winner = BOARD_STATE.PLAYING;
			}
			X = parsed_game.x.score;
			O = parsed_game.o.score;
			x_username = parsed_game.x.name;
			o_username = parsed_game.o.name;
			get_winner(boards);
		}
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
								if (
									(this_user === x_username && current_player === SQUARE_STATE.X) ||
									(this_user === o_username && current_player === SQUARE_STATE.O)
								) {
									select_square(i, j);
									get_winner(boards);
									get_available(j);
									if (game_id) {
										send_game();
									}
								}
							}}
						/>
					{/each}
				{/if}
			</section>
		{/each}
	{/if}
</main>

<footer class="p-2 grid grid-cols-2 gap-4 justify-items-center border-t border-black">
	<div class="flex flex-col">
		<h1 class="font-bold text-xl">
			{current_player === SQUARE_STATE.X ? 'X' : 'O'} á leik
		</h1>
		<h2>X: {X} stig</h2>
		<h2>O: {O} stig</h2>
	</div>
	<div class="flex justify-center flex-col gap-2">
		<div class="flex flex-col gap-1">
			<input
				class="p-1 border border-black disabled:bg-gray-300 text-sm rounded-xl"
				placeholder="Notendanafn"
				type="text"
				bind:value={this_user}
			/>
			<button
				class="p-1 border border-black disabled:bg-gray-300 text-sm rounded-xl"
				on:click={make_game}
				disabled={game_id ? true : false}>Smíða leik</button
			>
		</div>
		<div class="flex flex-col gap-1">
			<input
				type="text"
				class="p-1 border border-black disabled:bg-gray-300 text-sm rounded-xl"
				placeholder="Game id"
				bind:value={game_id}
			/>
			<button
				class="p-1 border border-black disabled:bg-gray-300 text-sm rounded-xl"
				on:click={join_game}
				disabled={game_id && this_user ? false : true}>join game</button
			>
		</div>
	</div>
	<p class="col-span-2">
		Til að spila leik eingöngu í þessum glugga þarf ekkert að gera, til þess að spila leik yfir
		netið þarf annar leikmaður að skrá notendanafn og smella á <span class="italic">Smíða leik</span
		>. Næst þarf hinn spilarinn að opna glugga í annari tölvu, slá þar inn notendanafn og
		leikjakóðann sem spilari 1 fékk úthlutað, svo er nóg að smella á
		<span class="italic">Spila leik</span> og njóta.
	</p>
</footer>

<img src="/O.svg" hidden alt="Pre loading the O token" />
<img src="/X.svg" hidden alt="Pre loading the X token" />
<img src="/XO.svg" hidden alt="Pre loading the draw token" />
