import { createRouter, createMemoryHistory } from "vue-router";


import test1View from "../pages/test1.vue";
import test2View from "../pages/test2.vue";


const routes = [
  {
    name: "test1",
    path: "/test1",
    component: test1View,
  },
  {
    name: "test2",
    path: "/test2",
    component: test2View,
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router