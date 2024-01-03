<script lang="ts">
	import { SQUARE_STATE } from '$lib/types';

	export let value: SQUARE_STATE;
	export let select: () => void;

	if (value > SQUARE_STATE.E) {
		console.log('value is greater than E');
	}

	const handleClick = () => {
		if (value !== SQUARE_STATE.E) {
			console.log('value is not E');
			return;
		}

		select();
	};
</script>

<button
	class="w-full min-w-8 aspect-square border border-black"
	class:x-square={value === SQUARE_STATE.X}
	class:o-square={value === SQUARE_STATE.O}
	on:click={handleClick}
/>
