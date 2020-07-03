<script>
  import { goto, stores } from '@sapper/app'
  import { onMount } from 'svelte'
  //TODO: figure out best way to import css from node module for the editor, which is created onMount
  import 'quill/dist/quill.snow.css'

  const { session } = stores()
  let quill;
  let editor
  let title;

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
              'tweet': async function(value){
                //value = 'https://twitter.com/kekethekhaleesi/status/1278548261205352448'
                value = prompt(`Enter the tweet's url:`)
                const cursorPosition = this.quill.getSelection().index;
                quill.insertEmbed(cursorPosition, 'tweet', { url: value });
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
		console.log(data)

  };
</script>

<h1>Site Admin</h1>
Title:
<input type="text" bind:value={title} />
<br/>
<div class="editor-wrapper">
  <div bind:this={editor}/>
</div>
<button on:click|preventDefault={saveArticle}>Save</button>