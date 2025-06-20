<script setup>
import { RouterLink } from 'vue-router'
import logo from "../assets/imdb2.png"
import { useAppStore } from '../stores/app.js'

const app = useAppStore()
</script>

<template>
  <header>
    <RouterLink to="/">
      <img src="../assets/imdb2.png" alt="Logo" height="50">
    </RouterLink>

    <template v-if="app.user">
      <RouterLink to="/profile">
        Profile
      </RouterLink>

      <RouterLink to="/login" @click="app.logout">
        Logout
      </RouterLink>
    </template>

    <template v-else>
      <RouterLink to="/register">
        Register
      </RouterLink>

      <RouterLink to="/login">
        Login
      </RouterLink>
    </template>


  </header>
</template>

<style scoped>
header {
  height: 50px;
  background-color: rgb(237, 184, 106);
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