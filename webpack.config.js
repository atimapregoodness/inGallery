const path = require("path");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  mode: "production", // Production mode for optimized build
  entry: "/public/src/app.js", // Entry point for your app
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  plugins: [
    new GenerateSW({
      clientsClaim: true, // Control pages as soon as the SW activates
      skipWaiting: true, // Install the new SW immediately
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/, // Cache images
          handler: "CacheFirst",
        },
        {
          urlPattern: new RegExp("https://api.example.com"), // Example: API responses
          handler: "NetworkFirst",
        },
      ],
    }),
  ],
};
