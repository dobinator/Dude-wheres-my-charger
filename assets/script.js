function sliderValue(vol) {
	document.querySelector('#mileOutput').textContent = vol;
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