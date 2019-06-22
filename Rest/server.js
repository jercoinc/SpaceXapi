// Import packages
const express = require("express");
const morgan = require("morgan");
// App
const app = express();
// Morgan
app.use(morgan("tiny"));

// Space x api=================================
//let space_x_return_data = "Hi";
/*** API call found here ***/
/*** https://codereview.stackexchange.com/questions/190212/code-to-call-space-x-api-and-display-results ***/
// URL to get all launches from SpaceX API
const space_X_URL = "https://api.spacexdata.com/v3/launches";

// Get launch data from API
const getLaunchData = async url => {
  let response = await fetch(url);

  // Check if response is ok, if not throw an error
  if (!response.ok) {
    throw Error(
      "Error getting API data, response status:  ${response.statusText}"
    );
  }

  let space_x_return_data = await response.json();
  return space_x_return_data;
  // NOTE:  Loading Space X Data alway crashed the service.
  // 
  // Format the data
  //formatData(data);
  //displayData(data);
};

// First route
app.get("/", (req, res) => {
  let space_x_return_data = getLaunchData(space_X_URL);
  res.json(space_x_return_data);
});
// Starting server
app.listen("3001");
