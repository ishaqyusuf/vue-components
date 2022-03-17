import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import { CustomComponentResolver } from "./src/components/ts/CustomComponentResolver";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver(),
        HeadlessUiResolver({
          prefix: "Tw",
        }),
        CustomComponentResolver({
          prefix: "X",
        }),
      ],
      dirs: ["./components"],
      deep: true,
    }),
    Icons({
      /* options */
    }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
  ],
});
