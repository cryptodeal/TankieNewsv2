<script>
	export let tabs;
	
	let activeTab = 0;
	$: activeComponent = tabs[activeTab].component;
	$: backpack = tabs[activeTab].backpack
</script>

<style>
	span {
		padding: 20px;
		cursor: pointer;
		user-select: none;
	}
	span.active {
		border-bottom: 1px solid #d74e4d;
		cursor: auto;
  }
  .titles {
    text-align: center;
  }
</style>

<div class=binder>
	<div class=titles>
		{#each tabs as {name}, i}
			<span 
				class="{activeTab === i ? 'active' : ''}"
				on:click={() => activeTab = i}
			>{name}</span>
		{/each}
	</div>
	<svelte:component this={activeComponent} {backpack} />
</div>