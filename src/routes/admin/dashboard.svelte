<script>
  import { goto, stores } from '@sapper/app'
  import { onMount } from 'svelte'
  const { session } = stores()
  let quill
  let editor
  let title;
	
	onMount(async() => {
    import('quill/dist/quill.snow.css')
		const { default: Quill } = await import('quill')
		quill = new Quill(editor, {
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            [{ 'align': [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            ["image"]
          ]
        },
        placeholder: "Compose an article...",
        theme: "snow" // or 'bubble'
      });
    })
  function testSave(){
    fetch('http://localhost:3000/api/content/articles')
  }
  async function saveArticle() {
    console.log(`here is the inner html: ${quill.root.innerHTML}`)
    await fetch(`http://localhost:3000/api/content/articles`, {
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
    });

  };

  let email = null
  let password = ''

</script>


<h1>Site Admin</h1>
Title:
<input type="text" bind:value={title} />
<br/>
<div bind:this={editor}></div>
<button on:click={saveArticle}>Save</button>