const music = require("../models/music");
const fs = require("fs");
let admins = [];
let mics = {};
let musicName = "FK Music";
let banned = [];

if (fs.existsSync("models/admins.json")) {
  admins = JSON.parse(
    fs.readFileSync("models/admins.json")
  ).admins || [];
}

function saveAdmins(){
  fs.writeFileSync(
    "models/admins.json",
    JSON.stringify({admins}, null, 2)
  );
}

function isAdmin(id){
  return admins.some(a => a.id === id);
}

function handleCommand(message, userId){

let args = message.split(" ");
let cmd = args[0];


// Admin List
if(cmd==="/admins"){
 return admins.map(a=>`👑 ${a.name} (${a.id})`).join("\n") || "No Admin";
}


// Add Admin
if(cmd==="/ma"){
 if(!isAdmin(userId)) return "❌ Admin Only";

 let id=args[1];
 admins.push({name:"Admin",id:id});
 saveAdmins();

 return `✅ Admin Added ${id}`;
}


// Remove Admin
if(cmd==="/rma"){
 if(!isAdmin(userId)) return "❌ Admin Only";

 let id=args[1];
 admins=admins.filter(a=>a.id!==id);
 saveAdmins();

 return `🗑 Removed ${id}`;
}


// Mic Lock
if(cmd==="/lm"){
 let mic=args[1];

 if(mic==="all"){
   mics="LOCK ALL";
 }else{
   mics[mic]="LOCK";
 }

 return `🔒 Mic ${mic} Locked`;
}


// Mic Unlock
if(cmd==="/ulm"){
 let mic=args[1];

 if(mic==="all"){
   mics="UNLOCK ALL";
 }else{
   mics[mic]="UNLOCK";
 }

 return `🔓 Mic ${mic} Unlocked`;
}


// Music Name
if(cmd==="/cn"){
 musicName=args.slice(1).join(" ");
 return `🎵 Music Name Changed: ${musicName}`;
}


// Say
if(cmd==="/say"){
 return `📢 Music: ${args.slice(1).join(" ")}`;
}


// Play System
if(cmd==="/play"){
 let song=args.slice(1).join(" ");
 return music.playSong(song || "Unknown Song");
}


if(cmd==="/stop"){
 return music.stopSong();
}


if(cmd==="/next"){
 return music.nextSong();
}


// Rejoin
if(cmd==="/rejoin"){
 return "🔄 Music Bot Rejoined Club";
}


// Ban Remove
if(cmd==="/ub"){
 return "✅ Users Unbanned";
}


// Whois
if(cmd==="/whois"){
 return `👤 Player ID: ${args[1]}`;
}


// Top Members
if(cmd==="/wtop"){
 return "🏆 Weekly Top Members Coming Soon";
}

if(cmd==="/mtop"){
 return "🏆 Monthly Top Members Coming Soon";
}


// Mic Request
if(cmd==="/mic"){
 return "🎤 Mic Request Sent";
}
if(cmd==="/joinMic" || cmd==="/joinmic"){
 return "🎤 Music Bot joined mic";
}
// ChatGPT Music
if(!cmd.startsWith("/")){
 return `🤖 FK AI: ${message}`;
}


return "❌ Unknown Command";

}


module.exports = handleCommand;
