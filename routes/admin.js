const express = require("express");
const router = express.Router();
const fs = require("fs");

const music = require("../models/music");

router.get("/admin", (req, res) => {

  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }

  let data = { users: [] };

  if (fs.existsSync("db.json")) {
    data = JSON.parse(fs.readFileSync("db.json"));
  }

  res.render("admin/dashboard", {
    users: data.users || [],
    totalUsers: (data.users || []).length,
    botStatus: global.botEnabled ? "ON" : "OFF",
    musicStatus: global.musicEnabled ? "ON" : "OFF",
     user: req.session.user,
     role: req.session.role,
      music: music.status()
});
  

});


// Add Member Page
router.get("/admin/add-member", (req,res)=>{
  res.send(`
  <h2>➕ Add Member</h2>
  <form method="POST">
  <input name="name" placeholder="Member Name">
  <button>Add</button>
  </form>
  `);
});


// Add Member
router.post("/admin/add-member", (req,res)=>{

 let data = {users:[]};

 if(fs.existsSync("db.json")){
   data = JSON.parse(fs.readFileSync("db.json"));
 }

 if(req.body.name){

   data.users.push({
     name:req.body.name,
     time:new Date().toLocaleString()
   });

 }

 fs.writeFileSync(
 "db.json",
 JSON.stringify(data,null,2)
 );

 res.redirect("/admin");

});


// Delete Member
router.get("/admin/delete-member/:name",(req,res)=>{

let data={users:[]};

if(fs.existsSync("db.json")){
 data=JSON.parse(fs.readFileSync("db.json"));
}

data.users=data.users.filter(
u=>u.name!==req.params.name
);

fs.writeFileSync(
"db.json",
JSON.stringify(data,null,2)
);

res.redirect("/admin");

});


module.exports = router;
