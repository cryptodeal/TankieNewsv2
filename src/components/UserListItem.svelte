<script>
  import Grid from 'svelte-grid-responsive'
  import EditUserModal from './EditUserModal.svelte';
	export let email;
  export let scope;
  let showEditUserModal = false;
</script>
<style>
  .list {
    position: inherit;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .card {
		position: inherit;
		margin: 0.5em;
		padding: 0.5em 0.5em 0.5em 3em;
		border: 1px solid #eee;
		border-radius: 4px;
		box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    height: auto;
	}
	.card::after {
		clear: both;
		display: block;
	}
</style>
  <div class='card'>
    <Grid container gutter={12}>
      <Grid xs={12} md={4} lg={4}>
        <p>{email}</p>
      </Grid>
      <Grid xs={12} md={4} lg={4}>
        <p>{scope}</p>
      </Grid>
      <Grid xs={12} md={4} lg={4}>
        <div class='list'>
          <button on:click="{() => showEditUserModal = true}">
            Details
          </button>
        </div>
      </Grid>
    </Grid>
  </div>

{#if showEditUserModal}
  <EditUserModal on:close="{() => showEditUserModal = false}">
    <h4 class="title" slot="header">
      Details for User <code>{email}</code>
    </h4>
    <p>{scope}</p>
  </EditUserModal>
{/if}