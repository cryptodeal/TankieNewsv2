<script>
  import { createForm } from 'svelte-forms-lib';
  import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications'
  let n;
  const { form, errors, state, handleChange, handleSubmit } = createForm({
  initialValues: {
    email: '',
    password: '',
  },
  validate: values => {
    console.log(values.email)
    console.log(values.password)
    let errs = {}
    let emailRegex = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if(values.email === ''){
      errs['email'] = 'Email is required'
      if(errs.email) notifier.danger('Email is required')
    }
    if(emailRegex.test(values.email) == false){
      errs['email'] = 'Please enter valid email address'
      if(errs.email) notifier.danger('Please enter valid email address')
    }
    if(values.password === ''){
      errs['password'] = 'Password is required'
      if(errs.password) notifier.danger(errs.password)
    }
    return errs;
  },
    onSubmit: values => {
      return register(values.email, values.password).then(function(response) {
        if (response.status === 401) {
          //alert('Email already taken')
          notifier.danger('Email already taken')
          event.preventDefault()
        } else{
          window.location.href= 'profile' 
        }
      })
    }
  });

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
    })
  }
</script>
<style>

  input[type=text], input[type=password]{
    width: 100%;
    height: 2em;
    box-sizing : border-box;
    border-radius: 4px;
  }
  .errors{
    height:1em;
  }
</style>

<form on:submit|preventDefault={handleSubmit}>
  <label for='email'>Email</label>
  <input
  id='email'
  name='email'
  type='text'
  placeholder='Enter email...'
  on:change={handleChange}
  bind:value={$form.email}
  />
  <div class=errors>
    {#if $errors.email}
      <NotificationDisplay bind:this={n} />
    {/if}
  </div>
  <br>
  <label for='password'>Password</label>
  <input
    id='password'
    placeholder='Enter password...'
    name='password'
    type='password'
    on:change={handleChange}
    bind:value={$form.password}
  />
  <div class=errors>
    {#if $errors.password}
      <NotificationDisplay bind:this={n} />
    {/if}
  </div>
  <br>
  <button type='submit'>Register</button>
</form>