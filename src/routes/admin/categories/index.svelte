<script context="module">
    export function preload({ params, query }) {
		return this.fetch(`admin/categories.json`).then(r => r.json()).then(categories => {
			return { categories };
		});
	}
</script>
<script>
    export let categories;
    import Sidebar from '../../../components/Sidebar.svelte'
    import CatModal from '../../../components/CatModal.svelte';
    import { goto, stores } from '@sapper/app'
    let sidebar_show = false;
    let catmodal_show = false;
</script>

<style>
  * {
      box-sizing: border-box;
  }
  ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
  }
  .row {
      display: flex;
  }
  main {
      position: relative;
      background-color: white;
      margin: 0 auto;
      box-sizing: border-box;
  }
  .column1 {
      padding: 10px;
      height: 100%;
      flex: 15%;
  }
  .column2 {
      flex: 85%;
      padding: 10px;
  }
  .openbtn {
    font-size: 13px;
    cursor: pointer;
    background-color: #d74e4d;
    color: white;
    padding: 10px 15px;
    border: none;
  }
</style>


<main>
  <div class="row">
    <CatModal bind:show={catmodal_show} />
    <div class='side'>
      <Sidebar bind:show={sidebar_show}/>
    </div>
    <div class="column1">
      <button class="openbtn" on:click={() => sidebar_show = !sidebar_show}>☰ Open Sidebar</button>
    </div>
    <div class="column2">
        <h1>Article Categories</h1>
            <ul>
              <button class="addCatBtn" on:click={() => catmodal_show = !catmodal_show}>New Category</button>
              {#if categories.length}
                {#each categories as category}
                    <!-- we're using the non-standard `rel=prefetch` attribute to
                            tell Sapper to load the data for the page as soon as
                            the user hovers over the link or taps it, instead of
                            waiting for the 'click' event -->
                    <li>{category.name}</li>
                {/each}
              {:else}
                <p>No categories to display</p>
              {/if}
            </ul>
    </div>
  </div>
</main>

