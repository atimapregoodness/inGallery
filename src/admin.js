const express = require('express');
// Uncomment and require your adminRoutes file if you want to mount additional routes
// const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Mount admin-specific routes at the root
// Due to Vercel rewrites, requests coming from admin.ingallery.xyz will be sent to this app.
// You can later uncomment the adminRoutes line below if you want to separate your route logic.
// app.use('/', adminRoutes);

// Define a simple route for '/home'
app.get('/home', (req, res) => {
  res.send("admin route");
});

// Fallback route to capture any unmatched endpoints
app.use((req, res) => {
  res.status(404).send('Admin route not found');
});

// For local testing purposes, you can run the app on a local port.
// When deployed on Vercel, this block is not used.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Admin service running on port ${PORT}`);
  });
}

module.exports = app;