const express = require("express");
const router = express.Router();

router.get("/privacy", (req,res)=>{
  res.send(`
  <h1>FK AI Bot Privacy Policy</h1>
  <p>We only use user information for login and app features.</p>
  `);
});

router.get("/terms", (req,res)=>{
  res.send(`
  <h1>FK AI Bot Terms of Service</h1>
  <p>By using this app you agree to our terms.</p>
  `);
});

router.get("/data-deletion", (req,res)=>{
  res.send(`
  <h1>User Data Deletion</h1>
  <p>To request deletion of your data, contact us.</p>
  `);
});

module.exports = router;
