require("dotenv").config();

const FB_APP_ID = process.env.FACEBOOK_APP_ID;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
console.log("Facebook App ID:", FB_APP_ID); 

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

app.get("/privacy", (req, res) => {
  res.send("<h1>Privacy Policy</h1><p>Your email and public profile are used for login.</p>");
});

app.get("/data-deletion", (req, res) => {
  res.send("<h1>User Data Deletion</h1><p>To delete your data, contact us at mashalkf2030@gmail.com or delete your Facebook account.</p>");
});

app.get('/test-ludo-token', async (req, res) =>
 {

//=EAAVrdJvboLEBSGgTwSKrZALL1JH1eAskO5dQTDz39KPn79uf3335QBklYH9c35p0G4NkvniyQR5LKBqb5z6bvW1HeysJbTEVHgIArYnuks0LtjI9Da6tiY06FYyFZAQz96nd38171qZBR3eTjQgC8JFsvGcncHwGPrEcS9k9ZBDKuhMeiWJhoiUYNt6Bg8HqZBCb6iTr8wAa2l5LXTkifsCwUDsNZAZCfiFPdgZB
  const token = req.query.token;
  
  if (!token) {
    return res.send('❌ Token missing. Add ?token=YOUR_TOKEN to URL');
  }

  try {
    // Step 1: Verify token with Facebook Graph API
    const verifyRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
    const userData = await verifyRes.json();

    if (userData.error) {
      return res.send(`
        <h2>❌ Token Invalid</h2>
        <p><b>Error:</b> ${userData.error.message}</p>
        <p><b>Type:</b> ${userData.error.type}</p>
        <p><b>Code:</b> ${userData.error.code}</p>
      `);
    }

    // Step 2: Get token debug info
    const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FB_CLIENT_ID}|${process.env.FB_CLIENT_SECRET}`);
    const debugData = await debugRes.json();

    res.send(`
      <h2>✅ Token Valid!</h2>
      <h3>Facebook User Info:</h3>
      <ul>
        <li><b>Name:</b> ${userData.name}</li>
        <li><b>ID:</b> ${userData.id}</li>
        <li><b>Email:</b> ${userData.email || 'N/A'}</li>
      </ul>
      <h3>Token Details:</h3>
      <ul>
        <li><b>App ID:</b> ${debugData.data?.app_id}</li>
        <li><b>Valid:</b> ${debugData.data?.is_valid}</li>
        <li><b>Expires:</b> ${debugData.data?.expires_at ? new Date(debugData.data.expires_at * 1000).toLocaleString() : 'Never'}</li>
        <li><b>Scopes:</b> ${debugData.data?.scopes?.join(', ')}</li>
      </ul>
      <h3>Raw Token (first 30 chars):</h3>
      <code>${token.substring(0, 30)}...</code>
      <hr>
      <p>✅ Ye token Ludo Star auth me use ho sakta hai.</p>
    `);

  } catch (err) {
    res.send(`<h2>❌ Server Error</h2><p>${err.message}</p>`);
  }
});

const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const pagesRoute = require("./routes/pages");
const controlRoute = require("./routes/control");

app.use(adminRoute);
app.use(authRoute);
app.use(pagesRoute);
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("FK Bot running on port 3000");
});
