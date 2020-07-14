<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		const res = await this.fetch(`admin/articles/edit/${params.slug}.json`);
		const data = await res.json();

		if (res.status === 200){
			const res2 = await this.fetch(`admin/articles/new.json`)
			const contributors = await res2.json();
			if (res2.status === 200){
        const res3 = await this.fetch(`api/content/categories`)
        const categories = await res3.json()
        if (res3.status === 200){
          return { article: data[0], contributors: contributors, categories: categories };
        }
			}
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let article;
  export let contributors;
  export let categories;
	import { goto, stores } from '@sapper/app'
  import { onMount } from 'svelte'
  import Select from 'svelte-select';
  import Textarea from "../../../../components/Textarea.svelte";
  import Grid from 'svelte-grid-responsive'
  import 'quill/dist/quill.snow.css'
  import Datepicker from 'svelte-calendar'
  import Sidebar from '../../../../components/Sidebar.svelte'

  const { session } = stores()
  let sidebar_show = false;
  let quill;
  const entry = {
    brief: ''
  }
  let editor;
  let stateOptions = ['draft', 'published', 'archived']
  let state = article.state;
  let title = article.title;
  const today = new Date();
  let start = new Date();
	let dateFormat = '#{l}, #{F} #{j}, #{Y}';
  let formattedSelected;
	let dateChosen = false;
	let exampleFormatted = false;
	let exampleChosen = false;
  let authors = []
  let selectedCat = []
  article.author.map(auth => {
    authors.push({value: auth._id, label: auth.email})
  })
  article.categories.map(cat => {
    selectCat.push({value: cat._id, label: cat.name})
  })

	onMount(async() => {
    const { default: Quill } = await import('quill')
    const BaseBlock = Quill.import('blots/block/embed');
    class TwitterBlot extends BaseBlock {
      static create(data) {
        const node = super.create(data);
        function buildInnerHtml(data) {
          window.twitter = function () {
            const loadScript = function (url) {
              return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = function () {
                  resolve(true);
                };
                script.onerror = function () {
                  reject();
                };
                document.head.appendChild(script);
              });
            };
            if (!window.twttr) {
              loadScript('//platform.twitter.com/widgets.js').then(() => {
                setTimeout(() => {
                  window.twttr.widgets.load();
                }, 100);
              });
            } else {
              setTimeout(() => {
                window.twttr.widgets.load();
              }, 100);
            }
          };
          return `
              <div contenteditable="false" style="display: flex; max-width: 100%;">
                <blockquote class="twitter-tweet tw-align-center"><a tabindex="-1" href="${data.url}"></a>Twitter</blockquote>
                <img src="*" onerror="event.stopPropagation(); event.preventDefault(); window.twitter();" style="display: none;"/>
              </div>
            `;
        }
        const innerHTML = buildInnerHtml(data);
        node.innerHTML = innerHTML;
        // node.setAttribute('contenteditable', false);
        // store data
        node.setAttribute('data-url', data.url);
        return node;
      }
      static value(domNode) {
        const { url } = domNode.dataset;
        return { url };
      }
      index() {
        return 1;
      }
    }
    TwitterBlot.blotName = 'tweet';
    TwitterBlot.className = 'ql-tweet';
    TwitterBlot.tagName = 'div';
    Quill.register({
	    'formats/twitter': TwitterBlot
    });
		quill = new Quill(editor, {
      modules: {
        toolbar: {
          container: [
            [{ header: [2, 3, false] }],
            [{ 'align': [] }],
            ["bold", "italic", "underline", "strike", "blockquote", "clean"],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['image', 'tweet']
          ],
          handlers: {
            'tweet': async function(){
              //value = 'https://twitter.com/kekethekhaleesi/status/1278548261205352448'
              let value = prompt(`Enter the tweet's url:`)
              if(value === '' || value == null){
                return null;
              } else{
                const cursorPosition = this.quill.getSelection().index;
                quill.insertEmbed(cursorPosition, 'tweet', { url: value });
              }
            }
          }
        }
      },
      placeholder: "Compose an article...",
      theme: "snow" // or 'bubble'
    });
    document.querySelector('.ql-tweet').innerHTML = '<svg viewBox="0 0 275 275" xmlns="http://www.w3.org/2000/svg"><path d="M91.1 239c94.4 0 146-78 146-145.8 0-2.3 0-4.5-.2-6.7 10-7.2 18.7-16.2 25.6-26.5-9.4 4.1-19.3 6.8-29.5 8a51.5 51.5 0 0 0 22.6-28.3c-10 6-21 10.2-32.6 12.4A51.3 51.3 0 0 0 135.6 99C94.4 96.9 56 77.4 30 45.3a51.3 51.3 0 0 0 15.9 68.5 51 51 0 0 1-23.3-6.4v.6a51.3 51.3 0 0 0 41.1 50.3c-7.5 2-15.4 2.4-23.1.9a51.3 51.3 0 0 0 48 35.6 103 103 0 0 1-76 21.3c23.5 15 50.7 23 78.6 23" fill="#444" fill-rule="nonzero"/></svg>'
  })

  async function saveArticle() {
    console.log(`here is the inner html: ${quill.root.innerHTML}`)
    let res = await fetch(`api/content/articles`, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
				extended: quill.root.innerHTML,
        author: authors,
        state: state.value,
        publishedDate: formattedSelected
      })
    })
    const data = await res.json();
		console.log(data)
  };

  async function deleteArticle() {
    console.log(`here is the inner html: ${quill.root.innerHTML}`)
    let res = await fetch(`api/content/articles`, {
      method: "DELETE",
      mode: 'cors',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title
      })
    })
    const data = await res.json();
		console.log(data)
  };
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
    margin: 0;
    box-sizing: border-box;
    max-width: 100%;
  }
  .column1 {
    flex: 13%;
    padding: 10px;
  }
  .column2 {
    flex: 87%;
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
  .custom-button {
	  display: inline-block;
	  background: #d74e4d;
	  color: #eee;
	  border: 1px solid black;
	  text-align: center;
	  padding: 15px 30px;
	  cursor: pointer;
	}
  .savebtn {
    padding: 5px;
    font-size: 13px;
    cursor: pointer;
    background-color: #2f4fff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 2px;
  }
  .deletebtn{
    float: right;
    font-size: 13px;
    cursor: pointer;
    background-color: #d74e4d;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 2px;
  }
  .savebtn:hover {
    background-color: #0f33ff;
  }
	form {
		display: grid;
  	max-width: 80%;
  	gap: 10px;
	}
</style>

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

<main>
  <div class="row">
    <div class='side'>
      <Sidebar bind:show={sidebar_show}/>
    </div>
    <div class="column1">
      <button class="openbtn" on:click={() => sidebar_show = !sidebar_show}>☰ Open Sidebar</button>
    </div>
    <div class="column2">
      <h1>Edit Article</h1>
			<Grid container gutter={12}>
        <Grid xs={12} md={2} lg={1}>
          Title:
        </Grid>
        <Grid xs={12} md={10} lg={11}>
          <input type="text" bind:value={title} />
        </Grid>
      </Grid>
      <br/>
      <Grid container gutter={12}>
        <Grid xs={12} md={2} lg={1}>
          State:
        </Grid>
        <Grid xs={12} md={10} lg={11}>
          <Select items={stateOptions} bind:selectedValue={state} inputStyles="box-sizing: border-box;"></Select>
        </Grid>
      </Grid>
      <br/>
      {#if state.value == 'published'}
        <Grid container gutter={12}>
          <Grid xs={12} md={2} lg={1}>
            Published Date:
          </Grid>
          <Grid xs={12} md={10} lg={11}>
            <Datepicker
            format={dateFormat}
            bind:formattedSelected
            bind:dateChosen
            highlightColor='#d74e4d'
            dayBackgroundColor='#efefef'
            dayTextColor='#333'
            dayHighlightedBackgroundColor='#d74e4d'
            dayHighlightedTextColor='#fff'
            >
              <button class='custom-button'>
                {#if dateChosen} Chosen: {formattedSelected} {:else} Pick a date {/if}
              </button>
            </Datepicker>
          </Grid>
        </Grid>
        <br/>
      {/if}
      <Grid container gutter={12}>
        <Grid xs={12} md={2} lg={1}>
          Authors:
        </Grid>
        <Grid xs={12} md={10} lg={11}>
          <Select items={contributors} isMulti={true} bind:selectedValue={authors}></Select>
        </Grid>
      </Grid>
      <br/>
      <Grid container gutter={12}>
        <Grid xs={12} md={2} lg={1}>
          Categories:
        </Grid>
        <Grid xs={12} md={10} lg={11}>
          <Select items={categories} isMulti={true} bind:selectedValue={selectedCat}></Select>
        </Grid>
      </Grid>
      <br/>
      <Grid container gutter={12}>
        <Grid xs={12} md={2} lg={1}>
          Content Brief:
        </Grid>
        <Grid xs={12} md={10} lg={11}>
          <form>
            <Textarea name={'Content Brief'} bind:value={entry.brief} />
          </form>
        </Grid>
      </Grid>
      <br/>
			<Grid container gutter={12}>
        <Grid xs={12} md={2} lg={1}>
          Content Extended:
        </Grid>
        <Grid xs={12} md={10} lg={11}>
          <div class="editor-wrapper">
            <div bind:this={editor}/>
          </div>
          <br/>
          <button class='savebtn' on:click|preventDefault={saveArticle}>Save</button>
          <button class='deletebtn' on:click={deleteArticle}>Delete</button>
        </Grid>
      </Grid>
    </div>
  </div>
</main>
