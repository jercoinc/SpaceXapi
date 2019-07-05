// =========================================================================================================
// WARNING -- This code is a prototype.  It was not refactored into proper functions due to time constraints
// =========================================================================================================

//alert("space_x_call loaded");

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

  let data = await response.json();

  // Format the data
  formatData(data);
};

getLaunchData(space_X_URL);

function formatData(data) {
  // Sort the flight numbers in descending order
  data.sort(function(a, b) {
    return b.flight_number - a.flight_number;
  });

  // Rank the items
  let rankArray = getRank(data);

  // Display Header
  let tempText = "<table id='SpaceXData'>";
  tempText += "<tr>";
  tempText += "<th>Launch Date</th>";
  tempText += "<th>Flight Number</th>";
  tempText += "<th>Mission Name</th>";
  tempText += "<th>Rocket Name</th>";
  tempText += "<th>Launch Status</th>";
  tempText += "<th>Payload Mass lbs</th>";
  tempText += "<th>Payload Rank</th>";
  tempText += "<th>Cargo Manifest</th>";
  tempText += "</tr>";

  // Build the rows
  for (counter = 0; counter < data.length; counter++) {
    // Slice at first space index and get the name of the market
    tempText += "<tr><td>";
    // Date will automaticaly default to correct time zone
    let launchDate = new Date(data[counter].launch_date_utc);
    // Reformat date and time
    let launchDateString =
      ("0" + (launchDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + launchDate.getDate()).slice(-2) +
      "/" +
      ("0" + launchDate.getFullYear()).slice(-4) +
      " " +
      ("0" + launchDate.getHours()).slice(-2) +
      ":" +
      ("0" + launchDate.getMinutes()).slice(-2) +
      ":" +
      ("0" + launchDate.getSeconds()).slice(-2);

    tempText += launchDateString;
    tempText += "</td>";
    tempText += "<td>";
    tempText += data[counter].flight_number;
    tempText += "</td>";
    tempText += "<td>";
    tempText += data[counter].mission_name;
    tempText += "</td>";
    tempText += "<td>";
    tempText += data[counter].rocket.rocket_name;
    tempText += "</td>";
    tempText += "<td>";

    // Convert launch boolean to message
    if (data[counter].launch_success === true) {
      tempText += "Successful";
    } else if (data[counter].launch_success === false) {
      tempText += "Failure";
    } else {
      tempText += "Not Launched";
    }

    tempText += "</td>";
    tempText += "<td>";

    let massLBS = 0;
    // Total the lbs for the flight
    for (
      lCounter = 0;
      lCounter < data[counter].rocket.second_stage.payloads.length;
      lCounter++
    ) {
      massLBS += Number(
        data[counter].rocket.second_stage.payloads[lCounter].payload_mass_lbs
      );
    }

    tempText += massLBS.toFixed(3);
    tempText += "</td>";

    tempText += "<td>";

    // Display the rank
    if (massLBS == 0) {
      tempText += "Not Ranked";
    } else {
      for (var i = 0; i < rankArray.length; i++) {
        if (rankArray[i].rankId == counter) {
          tempText += i + 1;
          break;
        }
      }
    }

    tempText += "</td>";
    tempText += "<td>";

    // Load the Manifest
    for (
      mCounter = 0;
      mCounter < data[counter].rocket.second_stage.payloads.length;
      mCounter++
    ) {
      let manifest =
        data[counter].rocket.second_stage.payloads[mCounter].cargo_manifest;

      if (mCounter > 0) {
        tempText += "<br />";
      }
      //tempText += "M=" +massLBS + " "
      if (manifest === null || manifest === undefined) {
        tempText += manifest = "M-" + (mCounter + 1) + " Not Available ";
      } else {
        tempText +=
          "<a href=" +
          manifest +
          " target='_blank'>View M-" +
          (mCounter + 1) +
          "</a> ";
      }
    }
    tempText += "</td>";

    tempText += "</tr>";
  }
  document.getElementById("results").innerHTML = tempText;

  tempText += "</table>";
}

// Build the rank array
function getRank(data) {
  let lbsRankArr = [];
  for (counter = 0; counter < data.length; counter++) {
    let lbsRankItem = { rankId: counter, lbs: 0 };
    for (
      pCounter = 0;
      pCounter < data[counter].rocket.second_stage.payloads.length;
      pCounter++
    ) {
      lbsRankItem.lbs += Number(
        data[counter].rocket.second_stage.payloads[pCounter].payload_mass_lbs
      );
    }
    lbsRankArr.push(lbsRankItem);
  }
  lbsRankArr.sort((a, b) => b.lbs - a.lbs); // descending order

  return lbsRankArr;
}
