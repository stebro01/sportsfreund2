import { boot } from "quasar/wrappers";
import { useAuthStore } from "stores/authStore";

export default boot(({ router }) => {
  if (!router) return;
  router.beforeEach((to) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.uid) {
      return { name: "Login" };
    }
  });
});
