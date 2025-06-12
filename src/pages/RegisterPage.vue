<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import { toast } from 'vue3-toastify'

onMounted(()=>{
  let token=localStorage.getItem('token')
  if(token){
    router.push('/')
    return
  }
})

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const gender = ref('male')

async function register() {
  if(!name.value || !email.value || !password.value || !confirmPassword.value) {
    // alert('Please enter all details')
    toast.error('Please enter all details')
    return
  }

  if(password.value !== confirmPassword.value) {
    toast.error('Passwords are not matching')
    return
  }

  const backend = import.meta.env.VITE_BACKEND
  const res = await fetch(`${backend}/auth/register`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
      gender: gender.value
    })
  })
  const json = await res.json()
  if(!res.ok) {
    toast.error(json.message)
    return
  }

  toast.success('User registered successfully')
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  await new Promise((res) => setTimeout(res, 2000))

  router.push('/login')
}
</script>

<template>
  <h1>Register</h1>

  <fieldset>
    <legend>Register Form</legend>

    <p>
      <label>Name: <input type="text" v-model="name" placeholder="enter name"></label>
    </p>
    <p>
      <label>Email: <input type="email" v-model="email" placeholder="enter email"></label>
    </p>
    <p>
      <label>Password: <input type="password" v-model="password" placeholder="enter password"></label>
    </p>
    <p>
      <label>Confirm Password: <input type="password" v-model="confirmPassword" placeholder="reenter the password"></label>
    </p>
    <p>
      <label><input type="radio" value="male" v-model="gender"> Male</label>
      <label><input type="radio" value="female" v-model="gender"> Female</label>
    </p>

    <button @click="register">Register</button>
  </fieldset>
  
</template>


<style scoped>
h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

fieldset {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 30px;
  border: 2px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

legend {
  font-size: 1.4em;
  font-weight: bold;
  color: #333;
  padding: 0 10px;
}

p {
  margin: 15px 0;
}

label {
  font-size: 1em;
  color: #333;
  display: flex;
  flex-direction: column;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
  margin-top: 5px;
}

p:nth-of-type(5) {
  display: flex;
  align-items: center;
  gap: 20px;
}

p:nth-of-type(5) label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

button {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  font-size: 1em;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}
</style>

