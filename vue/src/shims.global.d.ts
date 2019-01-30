import Vue, { VNode } from "vue";
import { GrafooClient } from "@grafoo/types";

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  interface Window {
    client: GrafooClient;
  }
}
