import Vue from "vue";
import { GrafooConsumerProps } from "@grafoo/types";

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    grafoo?: GrafooConsumerProps<unknown, unknown>;
  }
}
