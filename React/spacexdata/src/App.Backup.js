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
          headerName: "Make",
          field: "make",
          sortable: "true",
          resizable: true
        },
        {
          headerName: "Model",
          field: "model",
          sortable: "true",
          resizable: true
        },
        {
          headerName: "Price",
          field: "price",
          sortable: "true",
          resizable: true,
          sort: "desc"
        }
      ]
    };
  }
  // rowData: [
  //   {
  //     make: "Toyota",
  //     model: "Celica",
  //     price: 35000
  //   },
  //   {
  //     make: "Ford",
  //     model: "Mondeo",
  //     price: 32000
  //   },
  //   {
  //     make: "Porsche",
  //     model: "Boxter",
  //     price: 72000
  //   }
  // ]

  componentDidMount() {
    fetch("https://api.myjson.com/bins/15psn9")
      .then(result => result.json())

      //.then(rowData => this.parseData({ rowData }))
      .then(rowData => this.setState({ rowData }));
    //.then(this.onLoad);
  }

  parseData(response) {
    return response.data;
  }

  onLoad = rowData => {
    this.setState({
      rowData: this.parseData(rowData)
    });
  };

  // onLoad = rowData => {
  //   this.setState({
  //     rowData: this.parseData(rowData)
  //   });
  // };

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "600px"
        }}
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
        />
      </div>
    );
  }
}

export default App;
