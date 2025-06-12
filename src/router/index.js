import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import ErrorPage from '../pages/ErrorPage.vue'
import Profile from '../pages/Profile.vue'
import CreateMovie from '../pages/CreateMovie.vue'
import MovieDetails from '../pages/MovieDetails.vue'
import RatingList from '../pages/RatingList.vue'  // ✅ Add this

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', component: ErrorPage },
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/register',
      component: RegisterPage,
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path:'/profile',
      component:Profile,
    },
     {
      path:'/create',
      component:CreateMovie,
    },
     {
    path: '/movies/:id',
    component: MovieDetails,
  },
  {
  path: '/ratings/:id',
  component: RatingList,
},

  ],
})


export default router
