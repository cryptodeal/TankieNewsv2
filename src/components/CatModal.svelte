{#if show}
<div>
  <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 150}}>
    <div class="modal-container">
      <main>
        Name: 
        <input type="text" bind:value={name}/>
        <button class="saveCat" on:click={addCategory}>Save</button>
      </main>
    </div>
  </div>
</div>
{/if}

<script>
import { fade } from 'svelte/transition';
//let name;

function overlay_click(e) {
  if ('close' in e.target.dataset)
    show = false;
}

async function addCategory() {
    let res = await fetch(`api/content/categories`, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name
      })
    })
    const data = await res.json();
    window.location.href= 'admin/categories' 
		console.log(data)
  };

export let show = false;
export let name;
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
  width: 90vw;
  margin: 1rem auto 0.2rem;
  box-shadow: 0 3px 10px #555;
}
main {
  padding: 0.5rem;
}
</style>