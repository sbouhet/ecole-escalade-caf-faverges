<script>
	export let list = [];
	let isHovered = false;
	let x;
	let y;
	const OFFSET = 10
	
	function mouseOver(event) {
		isHovered = true;
		x = event.pageX + OFFSET;
		y = event.pageY + OFFSET;
	}
	function mouseMove(event) {
		x = event.pageX + OFFSET;
		y = event.pageY + OFFSET;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}>
	<slot />
</div>

{#if isHovered && list.length}
	<div style="top: {y}px; left: {x}px;" class="tooltip">
		{#each list as item}
			<div>{item}</div>
		{/each}
	</div>
{/if}

<style>
	.tooltip {
		box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
		background: var(--contrast);
		border-radius: var(--border-radius);
		padding: 5px;
		position: absolute;
		color: var(--contrast-inverse);
	}
	.tooltip div{
		margin: 5px;
	}
</style>