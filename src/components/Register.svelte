<script>
  import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications'
  import { emailValidator, requiredValidator, pwdSpecCharValidator } from './validators.js'
  import { createFieldValidator } from './validation.js'

  const [ emailValidity, emailValidate ] = createFieldValidator(requiredValidator(), emailValidator())
  const [ pwdValidity, pwdValidate ] = createFieldValidator(requiredValidator(), pwdSpecCharValidator())
  let n;
  let email = null;
  let password = null;

  function register (email, password) {
    return fetch('api/signup', {
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
      if(res.status === 409){
        notifier.danger('Email already registered')
      } else {
        window.location.href= 'profile'
      }
    })
  }
</script>
<style>
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
<form on:submit|preventDefault={register(email, password)}>
  <label for='email'>Email</label>
  <input class='input'
    type='text'
    id='email'
    name='email'
    bind:value={email}
    class:field-danger={!$emailValidity.valid}
    class:field-success={$emailValidity.valid}
    use:emailValidate={email}
  />
  {#if $emailValidity.dirty && !$emailValidity.valid}
    <p class='validation-hint'>
      INVALID: {$emailValidity.message} 
    </p>
  {/if}
  <label for='password'>Password</label>
  <input class='input'
    type='password'
    id='password'
    name='password'
    bind:value={password} 
    class:field-danger={!$pwdValidity.valid}
    class:field-success={$pwdValidity.valid}
    use:pwdValidate={password}
  />
  {#if $pwdValidity.dirty && !$pwdValidity.valid}
    <p class='validation-hint'>
      INVALID: {$pwdValidity.message} 
    </p>
  {/if}
  <button disabled={!$emailValidity.valid || !$pwdValidity.valid}>Login</button>
</form>