import { boot } from "quasar/wrappers";
import { useApiStore } from "stores/apiStore";
export default boot(({ app }) => {
  const apiStore = useApiStore();
  apiStore.init();

  app.config.globalProperties.$axios = apiStore.api;
  app.config.globalProperties.$api = apiStore.api;
});

export { useApiStore };
