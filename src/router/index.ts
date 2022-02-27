import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ConversationView from "../views/ConversationView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView
    },
    {
      path: "/conversations/:id(\\d+)",
      component: ConversationView
    }
  ]
});

export default router;
