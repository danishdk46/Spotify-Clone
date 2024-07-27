
let songs;
let currentSong = new Audio();
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".m4a")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // Show all Songs in the list
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUL.innerHTML = " ";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="music">
                            <div class="info">
                                <p> ${song.replaceAll("%20", " ")}</p>
                                <p>DK</p>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="playtop.svg" alt="play">
                            </div></li>`;
    }
    // Attach an Event Listener to each Song
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener('click',(element)=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs;
}
const playMusic = (track, pause=false)=> {
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00 : 00 / 00 : 00";
}

async function displayAlbums() {
    let a = await fetch(`/Music/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let allAs = div.getElementsByTagName('a');
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(allAs)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes('/Music')){
            let folder = e.href.split('/').slice(-2)[0];

        // Get the MetaData of the Folder
        let a = await fetch(`/Music/${folder}/info.json`);
        let response = await a.json();
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    fill="black">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <img src="/Music/${folder}/cover.jpg" alt="cover">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    }

     // Load the playlist when the card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`Music/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    });
}
async function main() {
    // Get the list of all Songs
    await getSongs("Music/cs");
    playMusic(songs[0], true);

    // Display all the albums on the page
    displayAlbums();

    // Attach an Event Listener to play, prev & next Song
    play.addEventListener('click', ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })
    // Listen for TimeUpdate Event
    currentSong.addEventListener('timeupdate', () => {
        let currentTimeMinutes = Math.floor(currentSong.currentTime / 60);
        let currentTimeSeconds = Math.floor(currentSong.currentTime % 60);
        let totalMinutes = Math.floor(currentSong.duration / 60);
        let totalSeconds = Math.floor(currentSong.duration % 60);
        
        document.querySelector(".songTime").innerHTML = 
                                                        (currentTimeMinutes < 10 ? "0" : "") + currentTimeMinutes + " : " + 
                                                        (currentTimeSeconds < 10 ? "0" : "") + currentTimeSeconds + 
                                                        " / " + 
                                                        (totalMinutes < 10 ? "0" : "") + totalMinutes + " : " + 
                                                        (totalSeconds < 10 ? "0" : "") + totalSeconds;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    // Attach an Event Listener to seekbar
    document.querySelector(".seekBar").addEventListener('click', (e) => {
        let percent = e.offsetX/e.target.getBoundingClientRect().width  * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = currentSong.duration * (percent / 100);
    })
    // Attach an Event Listener for Ham
    document.querySelector(".ham").addEventListener('click', ()=>{
        document.querySelector(".left").style.left = 0;
    })
    // Attach an Event Listener for Cross
    document.querySelector(".cross").addEventListener('click', ()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    // Attach an Event Listener for prev & next
    prev.addEventListener('click', ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index == 0){
            playMusic(songs[songs.length - 1]);
        }
        else{
            playMusic(songs[index - 1]);
        }
    })
    next.addEventListener('click', ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index == songs.length - 1){
            playMusic(songs[0]);
        }
        else{
            playMusic(songs[index + 1]);
        }
    })
    // Attach an Event Listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener('change', (e)=>{
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0){
            document.querySelector(".volume>img").src = "volume.svg";
        }
    }) 
    // Attach an Event Listener to mute
    document.querySelector(".volume>img").addEventListener('click', (e)=>{
        if (e.target.src.includes("volume.svg")){
            e.target.src = "mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = "volume.svg";
            currentSong.volume = 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = currentSong.volume * 100;
        }
    }
)
    
}
main();