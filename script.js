const API_KEY = "AIzaSyCuVczkQzXVaFgTfOUBKTuMvQ5sWvnB1Gg";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const maxresult = 11;
const videoContainer = document.getElementById("video_container");
const searchButton = document.getElementById("Search_input");
let main=document.getElementById("main");

async function searchVideos(searchQuery) {
  console.log("ser", searchQuery);
  if (searchQuery == "" || searchQuery == undefined) {
    document.title = "Youtube";
    searchQuery = "worldcup";
  } else {
    document.title = `${searchQuery} - Youtube`;
  }

  try {
    let url = `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&part=snippet&maxResults=10`;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    videoContainer.innerHTML = "";
    displayVideo(data.items);
  } catch (err) {
    console.log(err);
  }
}

searchVideos("");
function displayVideo(data) {
  data.map(async (item) => {
    const channedInfo = await channelDetails(item.snippet.channelId);

    const channelogo= channedInfo.items[0].snippet.thumbnails.high.url;

    const videoInfo = await videoDetailS(item.id.videoId);
    const viewsData = converViews(videoInfo.items[0].statistics.viewCount);

    const videoDiv = document.createElement("div");
    videoDiv.className = "video";
    videoDiv.addEventListener("click", () => {
      openVideo(item);
    });
    videoDiv.innerHTML = `<div class="thumbnail">
      <img
        src= ${item.snippet.thumbnails.high.url}
        alt=""
        width="100%"
        
      />
    </div>
    <div class="title">
      <div class="channel-profile">
        <div class="channel">
          <img
            src=${channelogo}
            alt=""
            width="100%"
            style="border-radius: 50%"
          />
        </div>
      </div>
      <div class="video-desc">
        <div class="video-info">
          ${item.snippet.title}
        </div>
  
        <div class="channel-name">
          <h3>${item.snippet.channelTitle}</h3>
          <h2>${viewsData} views · ${"10days ago"}</h2>
        </div>`;

    videoContainer.appendChild(videoDiv);
  });
}
async function videoDetailS(videoId) {
  try {
    let url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

async function channelDetails(channel_id) {
  try {
    let url = `${BASE_URL}/channels?key=${API_KEY}&part=snippet,statistics,contentOwnerDetails&id=${channel_id}`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//   searchVideos(localStorage.getItem("searchFromVideo"));

// videoDetailS("IIuRc8IiSuE");

function converViews(data) {
  const abbreviations = ["", "K", "M", "B"];

  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const divisor = Math.pow(10, i * 3);
    if (data >= divisor) {
      const result = (data / divisor).toFixed(1);
      // console.log(result);
      return result + abbreviations[i];
    }
  }

  return data.toString();
}

searchButton.addEventListener("submit", (e) => {
  e.preventDefault();

  searchVideos(e.target.search.value);
  e.target.search.value = "";
});

function searchFilters(event) {
  searchVideos(event.target.innerText);
}

function openVideo(item) {
  const jsonString = JSON.stringify(item);
  
  localStorage.setItem("videoToWatch", jsonString);
  window.location.href = "video.html";
}
