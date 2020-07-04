<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`admin/articles.json`).then(r => r.json()).then(articles => {
			return { articles };
		});
	}
</script>

<script>
	export let articles;
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
    }
    * {
        box-sizing: border-box;
    }

    .row {
        display: flex;
        padding-top: 5px
    }
    main {
        position: relative;
        background-color: white;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .column1 {
        flex: 15%;
        padding: 10px;
        background-color: #d74e4d;
    }
    .column1 a {
        padding: 6px 8px 6px 16px;
        text-decoration: none;
        font-size: 15px;
        color: #363636;
        display: inherit;
    }
    .column2 {
        flex: 85%;
        padding: 10px;
    }
    .column1 a:hover {
        color: #ffffff;
    }
</style>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<main>
  <div class="row">
    <div class="column1">
        <a href="admin/dashboard">Dashboard</a>
        <a href="admin/articles">Manage Articles</a>
    </div>
    <div class="column2">
        <h1>Recent articles</h1>
            <ul>
                {#each articles as article}
                    <!-- we're using the non-standard `rel=prefetch` attribute to
                            tell Sapper to load the data for the page as soon as
                            the user hovers over the link or taps it, instead of
                            waiting for the 'click' event -->
                    <li><a rel='prefetch' href='admin/articles/{article.slug}'>{article.title}</a></li>
                {/each}
            </ul>
    </div>
  </div>
</main>
