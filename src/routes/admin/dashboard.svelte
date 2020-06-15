<script>
  import { goto, stores } from '@sapper/app'
  import { onMount } from 'svelte'
  //TODO: figure out best way to import css from node module for the editor, which is created onMount
  import 'quill/dist/quill.snow.css'
  const { session } = stores()
  let quill
  let editor
  let title;

	onMount(async() => {
    const { default: Quill } = await import('quill')
    //import('quill/dist/quill.snow.css')
		quill = new Quill(editor, {
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            [{ 'align': [] }],
            ["bold", "italic", "underline", "strike", "blockquote", "clean"],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ["image"]
          ]
        },
        placeholder: "Compose an article...",
        theme: "snow" // or 'bubble'
      });
    })

  async function saveArticle() {
    console.log(`here is the inner html: ${quill.root.innerHTML}`)
    let res = await fetch(`http://localhost:3000/api/content/articles`, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        extended: quill.root.innerHTML,
      })
    })
    const data = await res.json();
		if (res.status === 201) {
			alert(data.message)
		} if (res.status === 401) {
			alert(data.message)
		} else {
      this.error(res.status, data.message);
    }

  };

  let email = null
  let password = ''

</script>



<h1>Site Admin</h1>
Title:
<input type="text" bind:value={title} />
<br/>
<div bind:this={editor}></div>
<button on:click|preventDefault={saveArticle}>Save</button>