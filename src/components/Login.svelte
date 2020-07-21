<script>
  import { createForm } from 'svelte-forms-lib';
  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values => {
      let errs = {}
      let emailRegex = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
      if(values.email === ''){
        errs['email'] = 'Email is required'
      }
      if(emailRegex.test(values.email) == false){
        errs['email'] = 'Please enter valid email address'
      }
      if(values.password === ''){
        errs['password'] = 'Password is required'
      }
      return errs;
    },
      onSubmit: values => {
        return login(values.email, values.password).then(function(response) {
          if (response.status === 401) {
            alert("Incorrect email or password. Please try again.")
            event.preventDefault()
          } else{
                window.location.href= 'profile' 
          }
        })
      }
  });

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
    })
  }
</script>
<style>
  small {
    color: red;
  }

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
  <form on:submit={handleSubmit}>
    <label for='email'>Email</label>
    <input
    id='email'
    name='email'
    type='text'
    placeholder='Enter email...'
    on:change={handleChange}
    on:blur={handleChange}
    bind:value={$form.email}
    />
    <div class=errors>
      {#if $errors.email}
        <small>{$errors.email}</small>
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
      on:blur={handleChange}
      bind:value={$form.password}
    />
    <div class=errors>
      {#if $errors.password}
        <small>{$errors.password}</small>
      {/if}
    </div>
    <br>
    <button type='submit'>Login</button>
  </form>
