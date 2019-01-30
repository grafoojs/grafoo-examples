import { VueConstructor } from "vue";
import { GrafooClient } from "@grafoo/types";
import createBindings from "@grafoo/bindings";

export let Plugin = (Vue: VueConstructor, client: GrafooClient) => {
  Vue.mixin({
    data() {
      let { grafoo } = this.$options;

      if (!grafoo) return {};

      let bindings = createBindings(client, grafoo, () => {
        let state = bindings.getState();

        for (let s in state) this[s] = state[s];
      });

      // @ts-ignore
      this.$bindings = bindings;

      return bindings.getState();
    },
    created() {
      let { grafoo } = this.$options;

      if (grafoo && !grafoo.skip && grafoo.query && !this.loaded) this.load();
    },
    beforeDestroy() {
      if (this.$bindings) this.$bindings.unbind();
    },
    watch: {
      skip(nextSkip) {
        if (!this.loaded && !nextSkip) this.load();
      },
      variables(nextVariables, variables) {
        if (nextVariables !== variables) this.load(nextVariables);
      }
    }
  });
};
