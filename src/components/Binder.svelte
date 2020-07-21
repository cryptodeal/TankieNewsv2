<script>
  export let tabs;
  import Grid from 'svelte-grid-responsive'
  import Image from 'svelte-image'; 
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
    height: 5vh;
    margin-bottom: 2vh;
  }
  flex-container {
    display: flex;
    flex-direction: column;
    width: 30vw;
    margin-right: 10vw;
    margin-left: 10vw;
    height: 43vh;
    align-items: center;
  }
  .logoColumn{
    width: 80%;
    align-self: center;
  }    
  .formColumn{
    height: 50%;
  }

</style>

<div class=binder>
  <div class=titles>
    {#each tabs as {name}, i}
      <span 
        class='{activeTab === i ? 'active' : ''}'
        on:click={() => activeTab = i}
      >{name}</span>
    {/each}
  </div>
</div>
<flex-container>
  <div class=logoColumn>
    <Image class='cool' src='tnn.png' alt='TNN logo small'/>
  </div>
  <div class=formColumn>
    <svelte:component this={activeComponent} {backpack} />
  </div>
</flex-container>
