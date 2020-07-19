<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
    // this file is called [slug].svelte
    return this.fetch(`admin/users.json`).then(r => r.json()).then(items => {
			return { items };
		});
	}
</script>
<script>
  export let items;
  import Grid from 'svelte-grid-responsive'
  import Sidebar from '../../components/Sidebar.svelte'
  import VirtualList from '../../components/VirtualList.svelte'
  import UserListItem from '../../components/UserListItem.svelte'
  import { goto, stores } from '@sapper/app'
  //console.log(items)
  let sidebar_show = false;
  let emailSearch = '';
  let scopeSearch = '';
  $: filteredList = items.filter(item => item.email.indexOf(emailSearch) !== -1 && item.scope.indexOf(scopeSearch) !== -1);
  let start;
  let end;

</script>
<style>
  * {
      box-sizing: border-box;
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
  .container {
		border-top: 1px solid #333;
		border-bottom: 1px solid #333;
		min-height: 200px;
		height: calc(100vh - 15em);
	}
</style>

<main>
  <div class="row">
    <div class='side'>
      <Sidebar bind:show={sidebar_show}/>
    </div>
    <div class="column1">
      <button class="openbtn" on:click={() => sidebar_show = !sidebar_show}>☰ Open Sidebar</button>
    </div>
    <div class="column2">
      <h1>Manage Users</h1>
        <div class='container'>
          <Grid container gutter={12}>
            <Grid xs={12} md={6} lg={6}>
              <p>Email:</p>
            </Grid>
            <Grid xs={12} md={6} lg={6}>
              <p>Permissions:</p>
            </Grid>
          </Grid>
          <Grid container gutter={12}>
            <Grid xs={12} md={6} lg={6}>
              Email Filter: <input bind:value={emailSearch}/>
            </Grid>
            <Grid xs={12} md={6} lg={6}>
              Permission Filter: <input bind:value={scopeSearch}/>
            </Grid>
          </Grid>
          <VirtualList items={filteredList} bind:start bind:end let:item>
		        <UserListItem {...item}/>
	        </VirtualList>
	        <p>showing users {start}-{end}</p>
        </div>
    </div>
  </div>
</main>