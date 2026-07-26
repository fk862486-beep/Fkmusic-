require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const fs = require("fs");

const app = express();
app.use(session({
  secret: "fk-secret-key",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const controlRoute = require("./routes/control");

app.use(adminRoute);
app.use(authRoute);
app.use(controlRoute);

global.botEnabled = true;
global.musicEnabled = true;
global.chats = [];

let users = [];

if (fs.existsSync("db.json")) {
  users = JSON.parse(fs.readFileSync("db.json")).users || [];
}

app.get("/", (req, res) => {
  res.send("FK AI Bot is Running 🤖");
});

app.post("/chat", (req, res) => {

  if (!global.botEnabled) {
    return res.json({
      reply: "🤖 Bot is OFF"
    });
  }

  let name = req.body.name || "Guest";
  let msg = (req.body.message || "").toLowerCase();

  if (!users.includes(name)) {
    users.push(name);

    global.chats.push({
      name: "FK AI Bot",
      message: "New User Joined",
      reply: `👋 Welcome ${name}! FK AI Bot me khush aamdeed 🤖`,
      time: new Date().toLocaleString()
    });

    fs.writeFileSync(
      "db.json",
      JSON.stringify({ users }, null, 2)
    );
  }

const handleCommand = require("./controllers/commands");

const fs = require("fs");

function isAdmin(name){
  if (!fs.existsSync("models/admins.json")) return false;

  let data = JSON.parse(
    fs.readFileSync("models/admins.json")
  );

  return data.admins.some(
    admin => admin.name === name || admin.id === name
  );
}

  let reply = "Mujhe samajh nahi aya 🤖";

if (msg.startsWith("/ma") || msg.startsWith("/rma")) {

  if (isAdmin(name)) {
    reply = handleCommand(msg);
  } else {
    reply = "❌ Admin permission required";
  }

}
else if (msg.startsWith("/")){

  reply = handleCommand(msg, name);
}

if (!msg.startsWith("/") && (msg.includes("hello") || msg.includes("hi") || msg.includes("salam"))) {
  reply = `👋 Hello ${name}! FK AI Bot me khush aamdeed 🤖`;
}
else if (!msg.startsWith("/") && msg.includes("name")) {
  reply = `Aap ka naam ${name} hai 👤`;
}
else if (msg.includes("status")) {
  reply = `🤖 AI: ${global.botEnabled ? "ON" : "OFF"} | 🎵 Music: ${global.musicEnabled ? "ON" : "OFF"}`;
}
else if (msg.includes("thank")) {
  reply = "Welcome 😊 FK AI hamesha aapki help ke liye ready hai.";
}

  
  else if (!msg.startsWith("/")) {
  reply = `Hello ${name}, aap ne kaha: ${msg}`;
}    

  global.chats.push({
    name: name,
    message: msg,
    reply: reply,
    time: new Date().toLocaleString()
  });

  res.json({ reply });
});

app.listen(3000, () => {
  console.log("FK Bot running on port 3000");
});
