import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => {
    return {
      showFiles: false
    };
  }
});
