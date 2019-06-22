import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Launch Date",
          field: "launch_date_utc",
          sortable: "true",
          resizable: true
        },
        {
          headerName: "Flight Number",
          field: "flight_number",
          sortable: "true",
          resizable: true,
          sort: "desc"
        },
        {
          headerName: "Mission Name",
          field: "mission_name",
          sortable: "true",
          resizable: true
        },
        {
          headerName: "Rocket Name",
          field: "rocket.rocket_name",
          sortable: "true",
          resizable: true
        },
        {
          headerName: "Launch Sucessful",
          field: "launch_success",
          sortable: "true",
          resizable: true
        },
        {
          headerName: "Payload Mass Lbs",
          // Grid does not like getting to the pounds and no easy way
          // to loop through the json array that I could find in this product
          // without more time. This workes in html version
          field: "rocket.second_stage.payloads[0].payload_mass_lbs",
          sortable: "true",
          resizable: true,
          boolean: "true"
        },
        {
          headerName: "Cargo Manifest",
          field: "rocket.second_stage.payloads[0].cargo_manifest",
          sortable: "true",
          resizable: true
        }
      ]
    };
  }

  componentDidMount() {
    fetch("https://api.spacexdata.com/v3/launches")
      .then(result => result.json())

      .then(rowData => this.setState({ rowData }));
  }

  parseData(response) {
    return response.data;
  }

  onLoad = rowData => {
    this.setState({
      rowData: this.parseData(rowData)
    });
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          className="ag-theme-balham"
          style={{
            height: "600px",
            width: "100%"
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }
}

export default App;
