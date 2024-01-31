const API_KEY = "AIzaSyCuVczkQzXVaFgTfOUBKTuMvQ5sWvnB1Gg";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
let dataToGet;

const videoPlayer = document.querySelector(".video-player");

const channelName = document.querySelector(".channel-name");

const videoDescText = document.querySelector(".video-desc-text");

const suggetions = document.querySelector(".suggetions");


let showMoreBefore;
let showMoreAfter;

function getDataFromStorage() {
  dataToGet = JSON.parse(localStorage.getItem("videoToWatch"));
  console.log(dataToGet);

  displayVideo(dataToGet);
}

async function displayVideo(data) {
  const youtubePlayer = document.createElement("div");
  youtubePlayer.className = "youtube-player";
  console.log(data);

  showMoreBefore = data.snippet.description;

  const videoData = await videoDetailS(data.id.videoId);

  document.title = data.snippet.title;

  youtubePlayer.innerHTML = `
  <iframe
    width="80%"
    height="80%"
    src="https://www.youtube.com/embed/${data.id.videoId}"
    frameborder="0"
    allowfullscreen
  ></iframe>
  <div class="video-info">
 <h3>${data.snippet.title}</h3>
  </div>
`;

  videoPlayer.appendChild(youtubePlayer);

  setSecondaryVideos(
    videoData.items[0].snippet.hasOwnProperty("tags")
      ? videoData.items[0].snippet.hasOwnProperty("tags")
      : videoData.items[0].snippet.title
  );
}

function setTopLevel(data) {
  if (data === "") {
    const searchFilter = document.createElement("div");
    searchFilter.className = "search-filter";
    searchFilter.innerHTML = `<h3>All</h3>`;
    document.querySelector(".top-level").appendChild(searchFilter);
  } else {
    data.map((item) => {
      const searchFilter = document.createElement("div");
      searchFilter.className = "search-filter";
      searchFilter.innerHTML = `<h3>${item}</h3>`;
      document.querySelector(".top-level").appendChild(searchFilter);
    });
  }
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

function createChannelThumbnail(channelInfo) {
  const channelThumbnail = channelInfo.items[0].snippet.thumbnails.high.url;

  const channelImg = document.createElement("div");

  // console.log(channelImg);

  showMoreAfter = channelInfo.items[0].snippet.description;

  channelImg.className = "channel-img";

  channelImg.innerHTML = `<img
    src=${channelThumbnail};
    alt=""
  />`;

  channelName.appendChild(channelImg);

  //   console.log(channelName);

  const channelTitle = document.createElement("div");
  channelTitle.className = "channel-title";

  channelTitle.innerHTML = `<h3>${channelInfo.items[0].snippet.title}</h3>
    `;

  channelName.appendChild(channelTitle);
}

async function searchVideos(searchQuery) {
  try {
    let url = `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&part=snippet&maxResults=30`;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    // console.log(data.items);
    return data;

    // displayVideo(data.items);
  } catch (err) {
    console.log(err);
  }
}

function convertVideoDuration(data) {
  let dateTime = "";
  data = data.substring(2);

  if (data.includes("H")) {
    dateTime += data.substring(0, data.indexOf("H")) + ":";
    data = data.substring(data.indexOf("H") + 1);
    // console.log(dateTime)
  }
  if (data.includes("M")) {
    dateTime += data.substring(0, data.indexOf("M")) + ":";
    data = data.substring(data.indexOf("M") + 1);
    // console.log(dateTime)
  } else {
    dateTime += "00:";
  }
  if (data.includes("S")) {
    dateTime += data.substring(0, data.indexOf("S"));
    data = data.substring(data.indexOf("S") + 1);
    // console.log(dateTime)
  } else {
    dateTime += "00";
  }

  return dateTime;
}

async function setSecondaryVideos(data) {
  const getSuggetions = await searchVideos(data);

  getSuggetions.items.map(async (item) => {
    const videosDetails = await videoDetailS(item.id.videoId);
    console.log(videosDetails.items[0]);

    const videoDuration = convertVideoDuration(
      videosDetails.items[0].contentDetails.duration
    );

    const suggetionVideo = document.createElement("div");

    suggetionVideo.className = "suggetion-video";

    suggetionVideo.addEventListener("click", async () => {
      const jsonString = JSON.stringify(item);
      localStorage.setItem("videoToWatch", jsonString);
      window.location.href = "video.html";
    });

    suggetionVideo.innerHTML = `<div class="suggetion-video">
    <div class="thumbnail">
      <div class="thumbnail-img">
        <img
          src=${item.snippet.thumbnails.high.url}
          alt=""
        />
      </div>
      <div class="thumbnail-time"><h3>${videoDuration}</h3></div>
    </div>
    <div class="video-text">
      <div class="video-title">
        <h3>${item.snippet.title}</h3>
      </div>
      <div class="video-channel-name"><h3>${item.snippet.channelTitle}</h3></div>
     
  </div>`;

    // console.log("hi");
    suggetions.appendChild(suggetionVideo);
  });
}

getDataFromStorage();
