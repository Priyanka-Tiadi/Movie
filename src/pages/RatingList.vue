<script setup>
import { ref, onMounted, watch, computed } from "vue";
import moment from "moment/moment";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import StarRating from "../components/StarRating.vue";
import {useAppStore} from '../Stores/app.js'

const app = useAppStore()

const router = useRouter();
const route = useRoute();
const rating = ref(0);
const review = ref("");
const props = defineProps(["movie"]);
const emit = defineEmits(["updateMovieRating"]);
const limit = ref(10);
const page = ref(1);
const ratings = ref([]);
const count = ref(0);
const selectedRating = ref("all");

const totalPages = computed(() => Math.ceil(count.value / limit.value));

async function fetchRating() {
  try {
    const backend = import.meta.env.VITE_BACKEND;
    const token = localStorage.getItem("token");
    const Id = route.params.id;

    const obj = {
      limit: limit.value,
      page: page.value,
    };
    if (selectedRating.value !== "all") {
      obj.rating = selectedRating.value;
    }
    const params = new URLSearchParams(obj);

    const res = await fetch(`${backend}/ratings/${Id}?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message || "Failed to fetch movies");
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      return;
    }

    ratings.value = json.ratings;
    count.value = json.count;
    toast.success("Ratings fetched successfully");
  } catch (error) {
    toast.error("Error: " + error.message);
  }
}

async function setRating() {
  try {
    const token = localStorage.getItem("token");
    const backend = import.meta.env.VITE_BACKEND;
    const res = await fetch(`${backend}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        movie: props.movie,
        rating: rating.value,
        review: review.value,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message);
      return;
    }
    ratings.value.push(json.rating);
    emit("updateMovieRating", json.movieRating);
    rating.value = 0;
    review.value = "";
    count.value++;

    toast.success("Rating created successfully");
  } catch (error) {
    toast.error("Error: " + error.message);
  }
}

async function deleteRating(rating) {
  if (!confirm("Are you sure you want to delete this rating?")) return;

  const backend = import.meta.env.VITE_BACKEND;
  const token = localStorage.getItem("token");

  const res = await fetch(`${backend}/ratings/${rating.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
   if (!res.ok) {
    toast.error(json.message || "Failed to delete cover");
    return;
  }
  toast.success("Rating deleted!");
  ratings.value = ratings.value.filter((e) => e.id !== rating.id);
  count.value--;
}
watch(selectedRating, fetchRating);
onMounted(() => {
  let token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  fetchRating();
});
</script>

<template>
  <!-- Rating Form Section -->
  <div class="rating-form-container">
    <form @submit.prevent="setRating" v-if="ratings.every(e => e.user !== app.user.id)">
      <div>
        <label>Your Rating:</label>
        <span>
          <StarRating :rating="rating" @change="(e) => (rating = e)" />
        </span>
      </div>

      <div>
        <label>Review:</label>
        <textarea v-model="review" required></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>

  <!-- Filter Section -->
  <div class="filter-section-wrapper">
    <p class="total-ratings">Total Ratings: {{ count }}</p>
    <div class="filter-section">
      <label for="rating-filter">Filter by Rating:</label>
      <select v-model="selectedRating">
        <option value="all">All Ratings</option>
        <option value="5">5 Star</option>
        <option value="4">4 Star</option>
        <option value="3">3 Star</option>
        <option value="2">2 Star</option>
        <option value="1">1 Star</option>
      </select>
    </div>
  </div>

  <!-- Ratings List -->
  <div class="ratings-list">
    <div class="rating-card" v-for="rating in ratings" :key="rating.id">
      <p><b>User:</b> {{ rating.user }}</p>
      <p><strong>Rating:</strong> <StarRating :rating="rating.rating" /></p>
      <p><strong>Review:</strong> {{ rating.review }}</p>
      <p><strong>Created At:</strong> {{ moment(rating.createdAt).fromNow() }}</p>
      <button @click="deleteRating(rating)"v-if="rating.user === app.user.id">❌</button>
    </div>
  </div>

  <!-- Pagination -->
  <div class="buttons">
    <button
      v-for="n of totalPages"
      :key="n"
      :class="{ active: n === page }"
      @click="page = n"
    >
      {{ n }}
    </button>
  </div>
</template>

<style scoped>
.rating-form-container {
  max-width: 500px;
  margin: 30px 0;
}

form {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

form div {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #333;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: vertical;
  background-color: #fff;
  box-sizing: border-box;
}

button[type="submit"] {
  padding: 10px 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

/* Filter section aligned */
.filter-section-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 20px 0;
}

.total-ratings {
  font-weight: bold;
  margin: 0;
}

.filter-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

select {
  padding: 6px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.ratings-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.rating-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 16px;
  transition: transform 0.2s;
}

.rating-card:hover {
  transform: translateY(-4px);
}

.rating-card p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.buttons {
  margin-top: 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #eee;
  cursor: pointer;
}

.buttons button.active {
  background-color: #4caf50;
  color: white;
}

@media (max-width: 600px) {
  .filter-section-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
