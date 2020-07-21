{#if show}
<div>
  <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 150}}>
    <div class="modal-container">
      <main>
        <Binder {tabs} />
      </main>
    </div>
  </div>
</div>
{/if}

<script>
  import { fade } from 'svelte/transition';
  import Login from './Login.svelte'
  import Register from './Register.svelte'
  import Binder from './Binder.svelte'
    
  const tabs = [
    { name: 'Login', component: Login },
    { name: 'Register', component: Register },
  ]
  //let name;

  function overlay_click(e) {
    if ('close' in e.target.dataset)
      show = false;
  }

  export let show = false;
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.modal-container {
  position: relative;
  background-color: #ffffff;
  width: 50vw;
  height: 50vh;
  margin: 1rem auto 0.2rem;
  box-shadow: 0 3px 10px #555;
}
main {
  padding: 1vh .5vw;
}
</style>