import { createRouter, createWebHistory } from 'vue-router'
import Users from '../views/Users.vue'
import Login from '../views/Login.vue'
import TabulaRasa from '../views/TabulaRasa.vue'
import Base from '../layouts/Base.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/base',
      component:Base,
      children:[
        {
          path:'/',
          component:Users
        },
        {
          path:'TabulaRasa',
          component:TabulaRasa
        }
      ]
    },
   
    
    {
      path:'/lg',
      component:Login
    }
  
  ]
})

export default router
