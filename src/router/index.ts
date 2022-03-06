import { createRouter, createWebHashHistory } from "vue-router";
import ConversationView from "../views/ConversationView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView
    },
    {
      name: "conversation",
      path: "/conversations/:id(\\d+)",
      component: ConversationView
    }
  ]
});

export default router;
