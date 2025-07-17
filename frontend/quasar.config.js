/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { configure } from "quasar/wrappers";

export default configure(function (ctx) {
  return {
    env: {
      APP_URL: process.env.APP_URL,
      APP_VERSION: process.env.APP_VERSION,
      APP_NAME: process.env.APP_NAME,
    },

    supportTS: false,

    boot: ["pinia", "autologin", "auth-guard", "axios", "logger", "firebase"],

    css: ["app.scss"],

    extras: ["roboto-font", "material-icons"],

    build: {
      vueRouterMode: "hash",
    },

    devServer: {
      port: 8080,
      open: true,
    },

    framework: {
      config: {},
      plugins: ["Notify", "Dialog"],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      middlewares: [ctx.prod ? "compression" : "", "render"],
    },

    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {},

      manifest: {
        name: `Quasar App`,
        short_name: `Quasar App`,
        description: `A Quasar Project`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      bundler: "packager",

      packager: {},

      builder: {
        appId: "sportsfreund2",
      },
    },
  };
});
