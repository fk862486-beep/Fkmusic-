const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/admin", (req, res) => {

if (!req.session.loggedIn) {
  return res.redirect("/login");
}
  let users = [];

  if (fs.existsSync("db.json")) {
    users = JSON.parse(
      fs.readFileSync("db.json")
    ).users || [];
  }

  res.render("admin/dashboard", {
    users: users,
    totalUsers: users.length,
    chats: global.chats || [],
    botStatus: global.botEnabled ? "ON" : "OFF",
    musicStatus: global.musicEnabled ? "ON" : "OFF"
  });

});

router.get("/admin/add-member", (req, res) => {
  res.send(`
    <h2>➕ Add Member</h2>
    <form method="POST" action="/admin/add-member">
      <input name="name" placeholder="Member Name">
      <button type="submit">Add</button>
    </form>
  `);
});

router.post("/admin/add-member", (req, res) => {
  let users = [];

  if (fs.existsSync("db.json")) {
    users = JSON.parse(fs.readFileSync("db.json")).users || [];
  }

  if (req.body.name) {
    users.push(req.body.name);

    fs.writeFileSync(
      "db.json",
      JSON.stringify({ users }, null, 2)
    );
  }

  res.redirect("/admin");
});

module.exports = router;
