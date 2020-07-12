<script>
import { fly } from 'svelte/transition';
//import Modal from './Modal.svelte';

export let show = false;
let modal_show = false;
</script>
<style>
nav {
  position: fixed;
  top: inherit;
  left: 0;
  height: auto;
  border-right: 1px solid #aaa;
  overflow-y: auto;
	width: 10rem;
  background-color: #d74e4d;
  display: flex;
	flex-direction: column;
	overflow-y: auto;
	color: #e1ffff;
}
.tabs a{
  text-decoration: none;
  display: block;
  padding: 5px 10px;
  font-size: 15px;
  color: white;
}
.tabs .closebtn{
  font-size: 20px;
  position: absolute;
  right: 5px;
  background-color: #d74e4d;
  border: none;
  color: white;
  text-decoration: none;
  outline: none;
  cursor: pointer;
}
</style>

{#if show}
  <nav transition:fly={{x: -250, opacity: 1}}>
    <div class='tabs'>
      <button class='closebtn' on:click={() => show = !show}>x</button>
      <a href='admin/dashboard'>Dashboard</a>
      <a href='admin/articles/new'>New Article</a>
      <a href="admin/articles">Edit Articles</a>
    </div>
  </nav>
{/if}

