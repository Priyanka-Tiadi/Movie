<script setup>
import {onMounted, ref} from 'vue'
import { useAppStore } from '../Stores/app.js'
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

onMounted(()=>{
  let token=localStorage.getItem('token')
  if(token){
    router.push('/')
    return
  }
})

const router = useRouter()
const app = useAppStore()
const email=ref('')
const password = ref('')

async function Login(){
  if(!email.value || !password.value){
    toast.error('please enter all details')
    return
  }
  const backend=import.meta.env.VITE_BACKEND
  const res= await fetch (`${backend}/auth/login`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
   body:JSON.stringify({
    email:email.value,
    password:password.value,
   })
  })

  const json = await res.json()
  if(!res.ok) {
 toast.error(json.message)
    return
  }

  toast.success('User loggedin successfully');
  localStorage.setItem("token",json.token)
  
  email.value = ''
  password.value = ''
  
  await new Promise((res) => setTimeout(res, 2000))

  router.push('/')
}


</script>

<template>
  <h1>Login</h1>
  <fieldset>
    <legend>Login Form</legend>

    <p>
      <label>Email:<input type="email" v-model="email" placeholder="enter email"></label>

    </p>
    <p><label>password:<input type="password" v-model="password" placeholder="enter password"></label></p>
    <button @click="Login">Login</button>
  </fieldset>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: Arial, sans-serif;
  color: #333;
}

fieldset {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 2px solid #2196f3;
  border-radius: 8px;
  background-color: #f9faff;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
}

legend {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2196f3;
  padding: 0 10px;
  font-family: Arial, sans-serif;
}

p {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #555;
  font-family: Arial, sans-serif;
}

input[type="email"],
input[type="password"] {
  padding: 10px;
  border-radius: 5px;
  border: 1.5px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.5);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #2196f3;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1976d2;
}
</style>
