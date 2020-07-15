<script>
  let email;
  let password;
  async function register () {
    await fetch('api/signup', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(function(response) {
    if (response.status === 401) {
      alert("Incorrect email or password. Please try again.")
    }
  })
      window.location.href= 'profile' 
  }
</script>
<br/>
<form>
  <select bind:value={email}>
    <option value={null}>-- Select User Type --</option>
    <option value="admin@example.com">Test Admin</option>
    <option value="contributor@example.org">Test Contributor</option>
    <option value="moderator@example.org">Test Moderator</option>
    <option value="subscriber@example.net">Test Subscriber</option>
    <option value="user@example.net">Test User</option>
  </select>
  <input id="password" type="password" bind:value={password} />
  <button id="login" type="button" disabled={!email} on:click={register}>Register</button>
  </form>