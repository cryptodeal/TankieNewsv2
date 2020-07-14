<script>
  import { goto, stores } from '@sapper/app'
  import UserModal from '../components/UserModal.svelte'
  const { session } = stores()
  let email = null
  let password = ''
  let usermodal_show = false;

  async function signUp () {
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
  async function clickTest() {
    alert('click registered!!!!')
  }

  async function login () {
    await fetch('api/session', {
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
<style>
  .main-box {
    max-width: 56em;
  }
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>
<div class="main-box">
  {#if $session.authenticated}
  <p>You are logged in as {$session.profile.name}</p>
  {:else}
  <UserModal bind:show={usermodal_show} />
  <button class="userModalBtn" on:click={() => usermodal_show = !usermodal_show}>Login/Signup</button>
  <form>
  <p>Login</p>
  <select bind:value={email}>
    <option value={null}>-- Select User Type --</option>
    <option value="admin@example.com">Test Admin</option>
    <option value="contributor@example.org">Test Contributor</option>
    <option value="moderator@example.org">Test Moderator</option>
    <option value="subscriber@example.net">Test Subscriber</option>
    <option value="user@example.net">Test User</option>
  </select>
  <input id="password" type="password" bind:value={password} />
  <button id="login" type="button" disabled={!email} on:click={login}>Login</button>
  </form>
  <br>
  <form>
  <p>Sign Up</p>
  <select bind:value={email}>
    <option value={null}>-- Select User Type --</option>
    <option value="admin@example.com">Test Admin</option>
    <option value="contributor@example.org">Test Contributor</option>
    <option value="moderator@example.org">Test Moderator</option>
    <option value="subscriber@example.net">Test Subscriber</option>
    <option value="user@example.net">Test User</option>
  </select>
  <input id="password" type="password" bind:value={password} />
  <button id="login" type="button" disabled={!email} on:click={clickTest}>Sign Up</button>
  </form>
  {/if}
</div>

