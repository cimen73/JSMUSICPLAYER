
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')


const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


let index


let loop = true

// decoding or parsing 
const songsList = [
    {
        name: "Işıklı Yol",
        link: "music/İzel - Işıklı Yol Official Audio.mp3",
        artist: "İZEL",
        image: "foto/izel.jpg"
    },
    {
        name: "Fuel To Fire",
        link: "music/Agnes Obel - Fuel To Fire Official Video.mp3",
        artist: "Agnes Obel",
        image: "foto/Agnes-obel.jpg"
    },
    {
        name: "Uçkun",
        link: "music/Mabel Matiz Uçkun.mp3",
        artist: "Mabel Matiz",
        image: "foto/mabel.jpg"
    },
    {
        name: "Ay Dil",
        link: "music/Mem ARARAT - Ay Dil Ji Konsera Bostanci Gosterî Merkezî.mp3",
        artist: "Mem Ararat",
        image: "foto/mem.jpg"
    }
]


let events = {
    mouse:{
        click: "click"
    },
    touch: {
        click: "touchstart"
    }
}

let deviceType = ""


const isTouchDevice = () =>{
    try{
        document.createEvent("TouchEvent") 
        deviceType = "touch"
        return true
    }catch(e){
        deviceType = "mouse"
        return false
    }
}


// time
const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" +second : second
    return `${minute}:${second}`
}

//music
const setSong = (arrayIndex) => {
   
    console.log(arrayIndex)
    let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image


    audio.onloadedmetadata = () =>{
        maxDuration.innerText = timeFormatter(audio.duration)//230 sn
    }
    playListContainer.classList.add('hide')
    playAudio()
}

//player
const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide') 
    playButton.classList.add('hide') 
}


//repeat
repeatButton.addEventListener('click',()=>{
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('tekrar kapatildi')
    }else {
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('tekrar acik')
    }
})


//for next song
const nextSong = () =>{
    
    if(loop){
        if(index == (songsList.length - 1)){
         //loop
            index = 0
        }else {
            index += 1 
        }

        setSong(index)
        playAudio()
    } else {
     //random music
        let randIndex = Math.floor(Math.random() * songsList.length)
        console.log(randIndex)
        setSong(randIndex)
        playAudio()
    }
}

//stop music
const pauseAudio= () =>{
    
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//before music
const previousSong = () =>{

    if(index > 0){
        pauseAudio()
        index -=1
    }else {
        index = songsList.length - 1
    }
    setSong(index)
    playAudio()
}



audio.onended = () =>{
    nextSong()
}


//shuffle songs
shuffleButton.addEventListener('click',()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop = true
        console.log("karistirma kapali")
    } else {
        shuffleButton.classList.add('active')
        loop = false
        console.log('karistirma acik')
    }
})


//play button
playButton.addEventListener('click',playAudio)

//next button
nextButton.addEventListener('click',nextSong)

//pause button
pauseButton.addEventListener('click', pauseAudio)

//prev button
prevButton.addEventListener('click', previousSong)

//device choose
isTouchDevice()
progressBar.addEventListener(events[deviceType].click,(event)=>{
    //proggress bar start
    let coordStart = progressBar.getBoundingClientRect().left

    
    // false
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth
    currentProgress.style.width = progress * 100 + "%"
    audio.currentTime = progress * audio.duration


    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')})

//progress update
setInterval(()=>{
    currentTimeRef.innerHTML  = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime/audio.duration.toFixed(3)) * 100 + "%"},1000)

//time update
audio.addEventListener('timeupdate',()=>{
    currentTimeRef.innerText = timeFormatter(audio.currentTime)})

//playlist 
const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"> 
          <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
            ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
        </li>`
    }
}  

//music list show
playListButton.addEventListener("click",()=>{
    playListContainer.classList.remove('hide')
})

//music list exit
closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})


window.onload = () =>{
 
    index = 0
    setSong(index)
    pauseAudio()
  
    initializePlaylist()}