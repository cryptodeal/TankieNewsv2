<script context='module'>
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
    import Modal from 'svelte-simple-modal'
    import Grid from 'svelte-grid-responsive'
    import Sidebar from '../../components/Sidebar.svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import UserListItem from '../../components/UserListItem.svelte'
    import { goto, stores } from '@sapper/app'
    let sidebar_show = false;
    let emailSearch = '';
    let scopeSearch = '';
    let useritemlist_show = false;
	  $: filteredList = items.filter(item => item.email.toLowerCase().indexOf(emailSearch.toLowerCase()) !== -1 && item.scope.toLowerCase().indexOf(scopeSearch.toLowerCase()) !== -1);
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
		height: calc(60vh - 15em);
	}
</style>

<main>
  <div class='row'>
    <div class='side'>
      <Sidebar bind:show={sidebar_show}/>
    </div>
    <div class='column1'>
      <button class='openbtn' on:click={() => sidebar_show = !sidebar_show}>☰ Open Sidebar</button>
    </div>
    <div class='column2'>
      <h1>Manage Users</h1>
        <Grid container gutter={12}>
          <Grid xs={12} md={4} lg={4}>
            <h3>Email: </h3> <input type='text' bind:value={emailSearch}/>
          </Grid>
          <Grid xs={12} md={4} lg={4}>
            <h3>Permissions: </h3>
            <select bind:value={scopeSearch}>
              <option value=''>-- Select User Type --</option>
              <option value='admin'>admin</option>
              <option value='user'>user</option>
            </select>
          </Grid>
          <Grid xs={0} md={4} lg={4}>
            <h3>Edit:</h3>
          </Grid>
        </Grid>
        <br/>
        <div class='container'>
          <VirtualList items={filteredList} bind:start bind:end let:item>
            <Modal>
              <UserListItem {...item}/>
            </Modal>
	        </VirtualList>
	        <p>showing users {start}-{end}</p>
        </div>
    </div>
  </div>
</main>