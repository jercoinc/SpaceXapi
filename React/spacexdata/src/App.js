import React, { Component } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const url = "https://api.spacexdata.com/v3/launches";
    const response = await fetch(url);
    let data = await response.json();
    // Sort before setting to state
    data.sort((a, b) => b.flight_number - a.flight_number);
    // Build Rank Array
    const rankArray = this.getRank(data);
    // Put SpaceX and Rank data in state.
    this.setState({ rowData: data, rankData: rankArray });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading Api Data...</div>;
    }

    if (!this.state.rowData) {
      return <div>No data returned from api</div>;
    }

    return (
      <div className="App">
        <table id="SpaceXData">
          <thead>{this.buildListHeader()}</thead>
          <tbody>
            {this.state.rowData.map(flight => (
              <React.Fragment key={flight.flight_number}>
                <tr>
                  <td>{this.formatDateTime(flight.launch_date_utc)}</td>
                  <td>{flight.flight_number}</td>
                  <td>{flight.mission_name}</td>
                  <td>{flight.rocket.rocket_name}</td>
                  <td>{this.formatLaunchSuccess(flight.launch_success)}</td>
                  <td>
                    {this.payloadTotal(flight.rocket.second_stage.payloads)}
                  </td>
                  <td>{this.displayRank(flight.flight_number)}</td>
                  <td>
                    {this.getManifest(flight.rocket.second_stage.payloads)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  buildListHeader() {
    // Display Header
    return (
      <tr>
        <th>Launch Date - Time</th>
        <th>Flight Number</th>
        <th>Mission Name</th>
        <th>Rocket Name</th>
        <th>Launch Status</th>
        <th>Payload Mass lbs</th>
        <th>Payload Rank</th>
        <th>Cargo Manifest</th>
      </tr>
    );
  }

  formatLaunchSuccess = input => {
    if (input === true) {
      return "Successful";
    } else if (input === false) {
      return "Failure";
    } else {
      return "Not Launched";
    }
  };

  getManifest = payLoadArray => {
    let manfestStore = "";
    for (let i = 0; i < payLoadArray.length; i++) {
      let tempManifest = payLoadArray[i].cargo_manifest;
      if (tempManifest === null || tempManifest === undefined) {
        manfestStore += "M-" + (i + 1) + " Not Available<br />";
      } else {
        manfestStore +=
          "<a href=" +
          tempManifest +
          " target='_blank'>View M-" +
          (i + 1) +
          "</a><br />";
      }
    }

    return <div>{ReactHtmlParser(manfestStore)}</div>;
  };

  payloadTotal = payLoadArray => {
    let lbsTotal = 0;
    for (let i = 0; i < payLoadArray.length; i++) {
      lbsTotal += payLoadArray[i].payload_mass_lbs;
    }

    return lbsTotal.toFixed(3);
  };

  displayRank = data => {
    const rankList = this.state.rankData;
    let rankValue = "Not Ranked" + rankList.length;

    for (let i = 0; i < rankList.length; i++) {
      if (rankList[i].rankId === data) {
        if (rankList[i].lbs === 0) {
          rankValue = "Not Ranked";
        } else {
          rankValue = i + 1;
        }

        break;
      }
    }
    return rankValue;
  };

  getRank = data => {
    let lbsRankArr = [];
    for (let counter = 0; counter < data.length; counter++) {
      let lbsRankItem = { rankId: data[counter].flight_number, lbs: 0 };
      for (
        let pCounter = 0;
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
  };

  formatDateTime = dateTimeParm => {
    let dtChange = new Date(dateTimeParm);
    // getMonth is zero based - This fixes it.
    let fixedMonth = dtChange.getMonth() + 1;
    let cMonth = (fixedMonth < 10 ? "0" : "") + fixedMonth;
    let cDay = (dtChange.getDate() < 10 ? "0" : "") + dtChange.getDate();
    let cYear = dtChange.getFullYear();
    let cHour = (dtChange.getHours() < 10 ? "0" : "") + dtChange.getHours();
    let cMinutes =
      (dtChange.getMinutes() < 10 ? "0" : "") + dtChange.getMinutes();

    return cMonth + "/" + cDay + "/" + cYear + " - " + cHour + ":" + cMinutes;
  };
}

export default App;
