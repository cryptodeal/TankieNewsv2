<script>
  import { goto, stores } from '@sapper/app'
  import Sidebar from '../../components/Sidebar.svelte'
  let sidebar_show = false;
  //TODO: figure out best way to import css from node module for the editor, which is created onMount
  const { session } = stores()
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
    height: 100%;
    flex: 15%;
    padding: 10px;
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
  .side {
    display: grid;
		grid-template-rows: 100vh;
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
      <h1>Admin Dashboard</h1>
    </div>
  </div>
</main>