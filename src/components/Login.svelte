<script>
  import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications'
  import { emailValidator, requiredValidator } from './validators.js'
  import { createFieldValidator } from './validation.js'

  const [ emailValidity, emailValidate ] = createFieldValidator(requiredValidator(), emailValidator())
  const [ pwdValidity, pwdValidate ] = createFieldValidator(requiredValidator())
  let n;
  
  let email = null;
  let password = null;
  function submit(){
    return login(email, password).then(function(response){
      if(response.status === 401){
        notifier.danger('Authentication failed')
      } else {
        window.location.href= 'profile'
      }
    })
  }
  function login (email, password) {
    return fetch('api/session', {
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
    }).then(res => {
      if(res.status === 401){
        notifier.danger('Authentication failed')
      } else {
        window.location.href= 'profile'
      }
    })
  }
</script>
<style>
  .body {
		display: flex;
		flex-direction: column;
    width: 30vw;
	}
	
	input {
		outline: none;
		border-width: 2px;
    border-style: solid;
    width: 100%;
	}
	
	.validation-hint {
		color: red;
    padding: 6px 0;
	}
	
	.field-danger {
		border-color: red;
	}
	
	.field-success {
		border-color: green;
	}
</style>
  <NotificationDisplay bind:this={n} />
<div class=body>
  <form on:submit|preventDefault={login(email, password)}>
    <input class='input'
      type='text'
      name="email"
      bind:value={email}
      class:field-danger={!$emailValidity.valid}
      class:field-success={$emailValidity.valid}
      use:emailValidate={email}
    />
    {#if $emailValidity.dirty && !$emailValidity.valid}
      <p class="validation-hint">
        INVALID: {$emailValidity.message} 
      </p>
    {/if}

    <input class='input'
      type="password"
      name="password"
      bind:value={password} 
      class:field-danger={!$pwdValidity.valid}
      class:field-success={$pwdValidity.valid}
      use:pwdValidate={password}
    />
    {#if $pwdValidity.dirty && !$pwdValidity.valid}
      <p class="validation-hint">
        INVALID: {$pwdValidity.message} 
      </p>
    {/if}
    <button disabled={!$emailValidity.valid || !$pwdValidity.valid}>Login</button>
  </form>
</div>

