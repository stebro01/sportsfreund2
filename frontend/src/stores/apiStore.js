import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "stores/errorStore";

export const useApiStore = defineStore("api", {
  state: () => ({
    api: null,
  }),
  actions: {
    init() {
      if (this.api) return;
      this.api = axios.create({ baseURL: "http://localhost:8000" });
      const errorStore = useErrorStore();
      this.api.interceptors.response.use(
        (response) => {
          errorStore.setOk();
          return response;
        },
        (error) => {
          errorStore.setError(error.message);
          return Promise.reject(error);
        }
      );
    },
    get(url, config) {
      return this.api.get(url, config);
    },
    post(url, data, config) {
      return this.api.post(url, data, config);
    },
    put(url, data, config) {
      return this.api.put(url, data, config);
    },
    delete(url, config) {
      return this.api.delete(url, config);
    },
  },
});
