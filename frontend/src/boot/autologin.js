import { boot } from "quasar/wrappers";
import { useAuthStore } from "stores/authStore";

export default boot(async () => {
  const auth = useAuthStore();
  await auth.autoLogin();
});
