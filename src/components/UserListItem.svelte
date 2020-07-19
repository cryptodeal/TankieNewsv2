<script>
  import Grid from 'svelte-grid-responsive'
	export let email;
	export let scope;
</script>

<Grid container gutter={12}>
  <Grid xs={12} md={6} lg={6}>
    <p>{email}</p>
  </Grid>
  <Grid xs={12} md={6} lg={6}>
    <p>{scope}</p>
  </Grid>
</Grid>
