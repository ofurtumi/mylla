<script lang="ts">
	import Square from './Square.svelte';
	import { get_winner } from '$lib/game';
	import { Icon, State } from '$lib/types';
	import type { Game, WinState } from '$lib/types';

	let game_over = false;
	let tie = false;
	let win_state: WinState;
	const board: Icon[] = new Array(9).fill(undefined);
	let game: Game = {
		board: new Array(9).fill(Icon.none),
		current: Icon.x,
		state: State.going,
		switch: (icon) => (icon % 2) + 1
	};

	console.log(game);
	const select = (position: number) => {
		game.board[position] = game.current;

		game = { ...game, ...get_winner(game.board) };
		if (game.state !== State.going) {
			game_over = true;
			if (game.state === State.won) {
				win_state = game.squares;
			} else {
				tie = true;
			}
		}

		game.current = game.switch(game.current);
	};
</script>

<div
	class="grid grid-cols-3 grid-rows-3 max-w-2xl mx-auto aspect-square items-center transition-all"
	class:tie
	class:game_over
>
	{#each board as _, i}
		<Square
			--won={win_state?.includes(i) ? 'green' : 'white'}
			icon={game.current}
			callback={select}
			position={i}
		/>
	{/each}

	<p>{State[game.state]}</p>
</div>

<style lang="postcss">
	.game_over {
		pointer-events: none;
	}
	.tie {
		background: yellow;
	}
</style>
