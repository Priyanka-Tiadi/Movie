<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const router = useRouter();
const movieName = ref("");

async function createMovie() {
  try {
    const backend = import.meta.env.VITE_BACKEND;
    const token = localStorage.getItem("token");

    // ✅ Guard clause for empty input
    if (!movieName.value.trim()) {
      toast.error("Movie name cannot be empty");
      return;
    }

    const res = await fetch(`${backend}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: movieName.value,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
       toast.error(json.message);
      if(res.status=== 401){
        localStorage.removeItem("token")
        router.push("/login")
      }
      return;
    }

    toast.success("Movie Created Successfully");
    await new Promise((res) => setTimeout(res, 2000));

    router.push("/");
  } catch (error) {
    toast.error("Error: " + error.message);
  }
}
</script>

<template>
  <div class="container">
    <h1>Create Movie</h1>
    <input
      type="text"
      placeholder="Enter movie name"
      v-model="movieName"
      class="movie-input"
    />
    <button class="save-btn" @click="createMovie">Save</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 12px;
  text-align: center;
  background-color: #f9f9f9;
}

.movie-input {
  width: 50%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 16px;
}

.save-btn {
  padding: 10px 20px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #0077cc;
}
</style>
