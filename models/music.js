let currentSong = "No Song";
let queue = [];

function playSong(song){

  if(currentSong === "No Song"){
    currentSong = song;
    return `🎵 Playing: ${song}`;
  }

  queue.push(song);
  return `📃 Added to Queue: ${song}`;
}


function nextSong(){

  if(queue.length > 0){
    currentSong = queue.shift();
    return `⏭ Next Song: ${currentSong}`;
  }

  currentSong = "No Song";
  return "🎵 Queue Empty";
}


function stopSong(){

  currentSong = "No Song";
  queue = [];

  return "⏹ Song Stopped";
}


function status(){

  return {
    currentSong,
    queue
  };

}


module.exports = {
 playSong,
 nextSong,
 stopSong,
 status
};
