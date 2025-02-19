// Snowpack config
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  root: './src',
  devOptions: {
    hmr: true,
    port: 5500,
    open: 'none'
  },
  optimize: {
    minify: true
  }
};