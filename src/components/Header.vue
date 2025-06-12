<script setup>
import { RouterLink } from 'vue-router'
import logo from "../assets/vue.svg"

function logout(){
  localStorage.removeItem('token')
}

</script>

<template>
  <header>
    <RouterLink to="/">
      <img :src="logo" alt="Logo" height="25" />
    </RouterLink>
    <RouterLink to="/Profile">Profile</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
     <RouterLink to="/login"@click="logout">Logout</RouterLink>
    
    
  </header>
</template>

<style scoped>
header {
  height: 50px;
  background-color: rgb(255, 208, 192);
  display: flex;
  align-items: center;
}
header img {
  margin-left: 30px;
}
a {
  color: orangered;
  font-weight: bold;
  margin-inline: 20px;
  text-decoration: none;
}
</style>
