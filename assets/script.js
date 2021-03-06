// const psKey = "561b5fdd2c9ef31ec83be9783559e272"; 
const oWKey = 'b40a49b598146847ec7cdb4601c0bec0';
var chargerInfo = [];
var searchHistory = JSON.parse(localStorage.getItem("History")) || [];

function init() {
  displaySearchHistory();
  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    getData(document.getElementById("usercity").value, document.getElementById("mileslider").value);
    document.getElementById("usercity").value = '';
  });

  document.getElementById("searchhistory").addEventListener("click", function (event) {
    getData(event.target.getAttribute("data-location"), event.target.getAttribute("data-range"))
  })

  window.onclick = function(e){
    if(e.target === document.querySelector('#errorModal')){
      document.querySelector('#errorModal').style.display = 'none'
    }
  }

}

function getData(address, distance) {
  document.querySelector('body').classList.add('cursor-wait');
  chargerInfo = [];
  // var psUrl = `http://api.positionstack.com/v1/forward?access_key=${psKey}&query=${address}`;
  var oWUrl = `https://api.openweathermap.org/data/2.5/weather?q=${address}&units=imperial&appid=${oWKey}`
  fetch(oWUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (oWData) {
      if (oWData.cod === '404') {
        callModal();
        document.querySelector('body').classList.remove('cursor-wait')
        return;
      }
      var lat = oWData.coord.lat;
      var lon = oWData.coord.lon;
      ocUrl = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${distance}`;
      fetch(ocUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (ocData) {
          saveSearchHistory(address, distance);
          displaySearchHistory();
          for (let i = 0; i < ocData.length; i++) {
            chargerInfo.push({});
            chargerInfo[i].title = ocData[i].AddressInfo.Title;
            chargerInfo[i].address = ocData[i].AddressInfo.AddressLine1;
            chargerInfo[i].town = ocData[i].AddressInfo.Town;
            chargerInfo[i].state = ocData[i].AddressInfo.StateOrProvince;
            chargerInfo[i].zip = ocData[i].AddressInfo.Postcode;
            chargerInfo[i].chargerType = [];
            if (ocData[i].Connections.length) {
              for (let x = 0; x < ocData[i].Connections.length; x++) {
                chargerInfo[i].chargerType.push(
                  ocData[i].Connections[x].ConnectionType.Title
                );
              }
            }
          }
          displayData();
          document.querySelector('body').classList.remove('cursor-wait');
        });
    });
}

function saveSearchHistory(location, range) {
  //condition needs to reject if location & range pair are previously saved
  const doesExist = searchHistory.some(
    (item) => item[0] === location && item[1] === range
  );
  if (doesExist) return;
  searchHistory.push([location, range]);
  localStorage.setItem("History", JSON.stringify(searchHistory));
}

function displaySearchHistory() {
  document.getElementById("searchhistory").innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    var history = document.createElement("li");
    history.classList = "border-2 border-blue-700 bg-blue-500 cursor-pointer px-2";
    history.setAttribute("data-location", searchHistory[i][0])
    history.setAttribute("data-range", searchHistory[i][1])
    history.textContent = `${searchHistory[i][0]}, ${searchHistory[i][1]}`;
    document.getElementById("searchhistory").appendChild(history);
  }
}

function displayData() {
  document.getElementById("searchresults").innerHTML = "";
  for (let i = 0; i < chargerInfo.length; i++) {
    var resultsCard = document.createElement("li");
    resultsCard.classList = "mt-2 border-2 border-blue-700 bg-indigo-400"; // add in classes once we know which we need
    resultsCard.innerHTML = `
            <h1 class="px-2">${chargerInfo[i].title}</h1>
            <a class="px-2 underline hover:text-green-400 cursor-pointer" href="https://www.google.com/maps/place/${chargerInfo[i].address +
      chargerInfo[i].town +
      chargerInfo[i].state +
      chargerInfo[i].zip
      }" target='_blank'>${chargerInfo[i].address} ${chargerInfo[i].town
      }, ${chargerInfo[i].state} ${chargerInfo[i].zip}</a>
            <h4 class="px-2">Charger Types: ${chargerInfo[i].chargerType.join(
        ", "
      )}</h4>
            `;
    document.getElementById("searchresults").appendChild(resultsCard);
  }
}

function sliderValue(val) {
  document.querySelector("#mileOutput").textContent = val + " Miles";
}

function callModal() {
  document.querySelector('#errorModal').style.display = 'block';
}

init();


/*
Logic Plan

//init function
    //populate search history
    //display data for last search
    //set up event listener for form submit
    //set up event listener for search history

//get data function (address, distance)
    //arguments from user input or search history
    //call positionstack api
        //get lat and lon value
        //call open charge map api
        //get chargers locations, addresses, and connection types
        //return

//dispaly data
    //create elements for each charger returned
    //set text conents based on values from apis
    //append to html

//display search history
    [["cityname", "numeric value of distance"], [etc], [etc]]


//add to search history
    //get search params from data function
    //save to local storage
    //add to search history list

//variables
//api key position stack
//positionstack api url
//open charge map api url
//lat and lon values (will be set equal to data from posistion stack at-> data.data[0].latitude & data.data[0].longitude)
//chargers info (array of objects, object will store title, address, town, state, postcode, array of charger types)
    // chargers info = [
        {
            title: Walmart 331 Sulphur,
            address: 525 N Cities Service Hwy,
            town: sulphur,
            state: LA,
            zip: 70663,
            chargerType: ["CHAdeMO", "CCS (Type 1)"]
        }
    ]



*/
