<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
    // this file is called [slug].svelte
    return this.fetch(`admin/users.json`).then(r => r.json()).then(data => {
			return { data };
		});
	}
</script>