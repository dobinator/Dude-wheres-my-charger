
const psKey="561b5fdd2c9ef31ec83be9783559e272"
var chargerInfo=[]
var searchHistory = JSON.parse(localStorage.getItem("History")) || [];

function getData(address, distance){
    var psUrl=`http://api.positionstack.com/v1/forward?access_key=${psKey}&query=${address}`
    fetch(psUrl)
        .then(function(response){
            return response.json()
        })
        .then(function(psData){
            var lat=psData.data[0].latitude
            var lon=psData.data[0].longitude
            ocUrl=`https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${distance}`
            fetch(ocUrl)
                .then(function(response){
                    return response.json()
                })
                .then(function(ocData){
                    console.log(ocData)
                    for (let i = 0; i < ocData.length; i++) {
                    chargerInfo.push({})
                    chargerInfo[i].title = ocData[i].AddressInfo.Title
                    chargerInfo[i].address = ocData[i].AddressInfo.AddressLine1
                    chargerInfo[i].town = ocData[i].AddressInfo.Town
                    chargerInfo[i].state = ocData[i].AddressInfo.StateOrProvince
                    chargerInfo[i].zip = ocData[i].AddressInfo.Postcode
                    chargerInfo[i].chargerType = [];
                    if (ocData[i].Connections.length) {
                        for (let x = 0; x < ocData[i].Connections.length; x++){
                        chargerInfo[i].chargerType.push(ocData[i].Connections[x].ConnectionType.Title)
                    }
                    }
                    }
                })
        })
}
function saveSearchHistory(location, range) {
    //condition needs to reject if location & range pair are previously saved
    const doesExist = searchHistory.some(
        (item) => item[0] === location && item[1] === range
    )
    if (doesExist) return;
    searchHistory.push([location, range]);
    localStorage.setItem("History", JSON.stringify(searchHistory));
}
/*


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
            postcode: 70663,
            chargers: ["CHAdeMO", "CCS (Type 1)"]
        }
    ]



*/