
// All elements from HTML
const details = document.querySelector("#details");
const trackArt = document.querySelector("#albumArt");
const song2 = document.querySelector("#song2");
const song3 = document.querySelector("#song3");
const artist = document.querySelector("#artist");
const album = document.querySelector("#album");
const disc = document.querySelector("#disc");
const audio = document.querySelector("#audio");
const time = document.querySelector("#currentTime");
const seeker = document.querySelector("#seek");
const duration = document.querySelector("#duration");
const volumecontrols = document.querySelector("#volume-controls");
const down = document.querySelector("#down");
const volume = document.querySelector("#volume");
const up = document.querySelector("#up");
const controls = document.querySelector("#controls");
const songs = document.querySelector("#song2");
const thirdsong= document. querySelector("#song3");
const past = document.querySelector("#past1");
const past2 = document.querySelector("#past2");


// Classes and buttons
const sliders = document.querySelector(".sliders");
const Volume = document.querySelector(".volume");
const reshuffle = document.querySelectorAll(".reshuffle");
const prevNext = document.querySelectorAll(".prevNnext");
const play = document.querySelector("#playPause");
const playlist = document.querySelector("#playlist");
const shuffle = reshuffle[0];
const rewind = reshuffle[1];
// Global variables
let trackIndex = 0;
let isPlaying = false;
let updateTimer;

// Page connection to player
const params = new URLSearchParams(window.location.search);
const selectedDecade = params.get("decade");

// Music library
const musicLibrary = {
    "1980s": [
        { title: "Rebell Yell", artist: "Billy Idol", album: "Rebel Yell", cover: "images/rebellyell.jpg", path: "music/rebelyell.mp3" },
        { title: "Quiet Life", artist: "Japan", album: "Quiet Life", cover: "images/quiet.jpg", path: "music/quietlife.mp3" },
        { title: "Revenge", artist: "Ministry", album: "With Sympathy", cover: "images/revenge.jpg", path: "music/revenge.mp3" },
        { title: "Little Lies", artist: "Fleetwood Mac", album: "Tango In the Night", cover: "images/littlelies.jpg", path: "music/littlelies.mp3" },
        { title: "Cherry-coloured Funk", artist: "Cocteau Twins", album: "Heaven or Las Vegas", cover:"images/cherry.jpg", path: "music/cherry.mp3" }
    ],
    "1990s": [
        { title: "Blue Monday", artist: "Orgy", album: "Candyass", cover: "images/bluemonday.jpg", path: "music/bluemonday.mp3" },
        { title: "So Into You", artist: "Tamia", album: "Tamia", cover: "images/sointoyou.jpg", path: "music/sointoyou.mp3" },
        { title: "Ready to Go", artist: "Republica", album: "Republica", cover: "images/readytogo.jpg", path: "music/readytogo.mp3" },
        { title: "Perfect", artist: "Smashing Pumpkins", album: "Adore", cover: "images/perfect.jpg", path: "music/perfect.mp3" },
        { title: "Smooth", artist: "Santana, Rob Thomas", album: "Supernatural", cover: "images/smooth.jpg", path: "music/smooth.mp3" }
    ],
    "2000s": [
        { title: "Draostea", artist: "O-Zone", album: "DiscO-Zone", cover: "images/drao.jpg", path: "music/drago.mp3" },
        { title: "Never Let This Go", artist: "Paramore", album: "All We Know Is Falling", cover: "images/paramore.jpg", path: "music/never.mp3" },
        { title: "Thinking Of You", artist: "Katy Perry", album: "One Of The Boys", cover: "images/one.jpg", path: "music/thinkingof.mp3" },
        { title: "She Wolf", artist: "Shakira", album: "She Wolf", cover: "images/shewolf.jpg", path: "music/shewolf.mp3" },
        { title: "Pose", artist: "Daddy Yankee", album: "Taleno de Barrio", cover: "images/pose.jpg", path: "music/pose.mp3" }
    ],
    "2010s": [
        { title: "Lights", artist: "Ellie Goulding", album: "An introduction to Ellie Goulding", cover: "images/lights.jpg", path: "music/lights.mp3" },
        { title: "Outside (ft. Ellie Goulding)", artist: "Calvin Harris, Ellie Goulding", album: "Motion", cover: "images/outside.jpg", path: "music/outside.mp3" },
        { title: "Cool Kids", artist: "Echosmith", album: "Talking Dreams", cover: "images/coolkids.jpg", path: "music/coolkids.mp3" },
        { title: "Hometown", artist: "Twenty One Pilots", album: "BlurryFace", cover: "images/hometown.jpg", path: "music/hometown.mp3" },
        { title: "Stay The Night (ft. Hayley Williams)", artist: "Zedd, Hayley Williams", album: "Clarity", cover: "images/stay.jpg", path: "music/stay.mp3" }
    ]
};

// Get songs for selected decade
const selectedSongs = musicLibrary[selectedDecade];

console.log("Selected decade:", selectedDecade);
console.log("Selected songs:", selectedSongs);
console.log("Number of songs:", selectedSongs?.length);

// Load a track
function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();

    const song = selectedSongs[track_index];

    trackArt.style.backgroundImage = "url('" + song.cover + "')";
    artist.textContent = song.artist;
    album.textContent = song.title;
    audio.src = song.path;
    audio.load();
    updateUpcomingSongs();
}

//playlist
function displayPlaylist(){
   playlist.innerHTML = "";
    selectedSongs.forEach(function(song, index) {
        const songItem = document.createElement("div");

        songItem.textContent = song.title + " - " + song.artist;
        songItem.classList.add("playlistSong");
        
        songItem.innerHTML = `
            <span class="trackNumber">${String(index + 1).padStart(2, "0")}</span>
            <div class="songInfo">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        `;
         songItem.addEventListener("click", function() {
            trackIndex = index;
            loadTrack(trackIndex);
            audio.play();
        });


        playlist.appendChild(songItem);
    });
    }


// Reset player values
function resetValues() {
    time.textContent = "0:00";
    duration.textContent = "0:00";
    seeker.value = 0;
}

// Format song time
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

// Update seek bar and current time
function seek() {
    if (audio.duration) {
        seeker.value = (audio.currentTime / audio.duration) * 100;
        time.textContent = formatTime(audio.currentTime);
    }
}

// Display song duration
audio.addEventListener("loadedmetadata", function() {
    duration.textContent = formatTime(audio.duration);
});

// Play and pause
play.addEventListener("click", function() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Update play button and timer
audio.addEventListener("play", function() {
    play.textContent = "❚❚";
    isPlaying = true;
    document.getElementById("playPause").title = "Play"
    clearInterval(updateTimer);
    updateTimer = setInterval(seek, 1000);
});

audio.addEventListener("pause", function() {
    play.textContent = "▶";
    isPlaying = false;
    clearInterval(updateTimer);
    document.getElementById("playPause").title = "pause"

});

// Move to next track
function nextTrack() {
    trackIndex++;

    if (trackIndex >= selectedSongs.length) {
        trackIndex = 0;
    }

    loadTrack(trackIndex);
    audio.play();
}

//move back 
function previousTrack() {
    trackIndex--;

    if (trackIndex < 0) {
        trackIndex = selectedSongs.length - 1;
    }

    loadTrack(trackIndex);
    audio.play();
}
// Rewind current song
function Rewindtrack() {
    audio.currentTime = 0;
    audio.play();
}

// Detect single and double clicks
let clickTimer = null;

rewind.addEventListener("click", function() {

    if (clickTimer !== null) {
        clearTimeout(clickTimer);
        clickTimer = null;

        // Double click: play previous track
        previousTrack();

    } else {

        clickTimer = setTimeout(function() {

            // Single click: restart current track
            Rewindtrack();

            clickTimer = null;

        }, 300);
    }
});
// Previous and next buttons
prevNext[0].addEventListener("click", previousTrack);
prevNext[1].addEventListener("click", nextTrack);
shuffle.addEventListener("click", shuffleTrack);

// Automatically play next song when current song ends
audio.addEventListener("ended", nextTrack);


// Move through the song using the seek bar
seeker.addEventListener("input", function() {
    if (audio.duration) {
        audio.currentTime = (seeker.value / 100) * audio.duration;
    }
});

// Volume control
volume.addEventListener("input", function() {
    audio.volume = volume.value / 100;
});

audio.volume = volume.value / 100;

// Load the first song from the selected decade
if (selectedSongs && selectedSongs.length > 0) {
    loadTrack(trackIndex);
    displayPlaylist();
} else {
    console.error("No songs found for this decade:", selectedDecade);
}

function shuffleTrack() {
    let randomIndex = Math.floor(Math.random() * selectedSongs.length);

    while (randomIndex === trackIndex && selectedSongs.length > 1) {
        randomIndex = Math.floor(Math.random() * selectedSongs.length);
    }

    trackIndex = randomIndex;
    loadTrack(trackIndex);
    audio.play();
}

//preview of next songs
function updateUpcomingSongs() {

    const totalSongs = selectedSongs.length;

    if (totalSongs === 0) return;

    // Previous tracks
    const previous1 = selectedSongs[(trackIndex - 1 + totalSongs) % totalSongs];
    const previous2 = selectedSongs[(trackIndex - 2 + totalSongs) % totalSongs];

    // Upcoming tracks
    const next1 = selectedSongs[(trackIndex + 1) % totalSongs];
    const next2 = selectedSongs[(trackIndex + 2) % totalSongs];

    // Display previous album covers
    past.innerHTML = `<img src="${previous1.cover}" alt="Previous album cover">`;
    past2.innerHTML = `<img src="${previous2.cover}" alt="Previous album cover">`;

    // Display upcoming album covers
    song2.innerHTML = `<img src="${next1.cover}" alt="Upcoming album cover">`;
    song3.innerHTML = `<img src="${next2.cover}" alt="Upcoming album cover">`;
}
audio.addEventListener("play", function() {
    trackArt.style.animationPlayState = "running";
});

audio.addEventListener("pause", function() {
    trackArt.style.animationPlayState = "paused";
});

const decadeButtons = document.querySelectorAll(".decade");

decadeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const decade = button.dataset.decade;

        window.location.href = "player.html?decade=" + decade;

    });

});

