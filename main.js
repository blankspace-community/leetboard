// GLOBAL VARIABLES

const gold_medal = `<img class="gold-medal" src="assets/img/gold-medal.png" alt=""/>`;
let api_response = [];
let tableHTML = "";

let loadDetails = localStorage.getItem("pageLoadCount");

// Share API
document.addEventListener("DOMContentLoaded", () => {
  const shareButton = document.getElementById("shareButton");

  shareButton.addEventListener("click", () => {
    if (navigator.share) {
      const shareData = {
        title: "Beta-leetcoders Leaderboard",
        text: "Check out the leaderboard for the beta-leetcoders!",
        url: "https://blankspace-community.github.io/leetboard/",
      };

      navigator
        .share(shareData)
        .then(() => {
          console.log("Shared successfully!");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      console.log("Share API not supported in this browser");
    }
  });
});

// Page Load Count
if (loadDetails) {
  let counter = JSON.parse(loadDetails).pageLoadCount + 1;
  // just update the counter and keep the date same.
  let currentDate = JSON.parse(loadDetails).date;
  localStorage.setItem(
    "pageLoadCount",
    JSON.stringify({
      pageLoadCount: counter,
      date: currentDate,
    })
  );
  console.log("local storage: ", localStorage.getItem("pageLoadCount"));
} else {
  localStorage.setItem(
    "pageLoadCount",
    JSON.stringify({ pageLoadCount: 1, date: new Date() })
  );
  console.log("local storage: ", localStorage.getItem("pageLoadCount"));
}

// Fetch API
if (!maxLimitReached()) {
  fetch(
    "https://script.google.com/macros/s/AKfycbwNwVhQXjsohc0KyhZuqUapvNAZOupwVS3peWEVLkHyiYj_DpW4qhmKo2KleZzzomqb6Q/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      api_response = data;
      document.getElementById("leaderboard-table").innerHTML = "";
      for (let i = 0; i < api_response.length; i++) {
        tableHTML += `<tr>
          <td class="number">${api_response[i].NO}</td>
          <td class="name">${api_response[i].NAME}</td>
          <td class="points">${api_response[i].SOLVED} ${
          i === 0 ? gold_medal : ""
        }</td>
          </tr>`;
      }
      document.getElementById("leaderboard-table").innerHTML = tableHTML;
      localStorage.setItem("tableHTML", tableHTML);
    })
    .catch((error) => {
      console.log(error);
      document.getElementById(
        "leaderboard-table"
      ).innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    });
} else {
  console.log("Max limit reached");
  document.getElementById("leaderboard-table").innerHTML =
    localStorage.getItem("tableHTML");
}

// Max Limit Reached
function maxLimitReached() {
  loadDetails = localStorage.getItem("pageLoadCount");
  if (!loadDetails) return false;
  const savedDetails = JSON.parse(loadDetails);
  if (
    savedDetails.pageLoadCount > 1 &&
    new Date(savedDetails.date).toDateString() === new Date().toDateString()
  ) {
    return true;
  }
  return false;
}
