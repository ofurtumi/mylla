<script lang="ts">
	import { Icon } from '$lib/types';

	export let callback: (position: number) => void;
	export let icon: Icon;
	export let position: number;

	let iconPath: string;

	let chosen = false;

	const choose = (e: Event) => {
		if (chosen) return;
		else if (e.type === 'keypress') {
			const keyvent = e as KeyboardEvent;
			if (!['Enter', 'Space'].includes(keyvent.code)) return;
		}
		chosen = true;
		iconPath = `/${Icon[icon]}.svg`;
		callback(position);
	};
</script>

<button
	class="w-full h-full border-black border-2 box-border p-4 winning"
	on:click={(e) => choose(e)}
	on:keypress={(e) => choose(e)}
>
	<img src={iconPath ?? ''} alt="chosen icon" />
</button>

<style lang="postcss">
	.winning {
		background: var(--won, none);
	}
</style>
