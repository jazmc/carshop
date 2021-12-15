import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCar from "./AddCar";
import EditCar from "./EditCar";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

export default function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCars = () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const columns = [
    { field: "brand", sortable: true, filter: true, flex: 2 },
    { field: "model", sortable: true, filter: true, flex: 2 },
    { field: "color", sortable: true, filter: true, flex: 1 },
    { field: "year", sortable: true, filter: true, flex: 1 },
    { field: "fuel", sortable: true, filter: true, flex: 1 },
    { field: "price", sortable: true, filter: true, flex: 1 },
    {
      headerName: "",
      field: "_links.self.href",
      cellRendererFramework: (params) => (
        <EditCar editCar={editCar} params={params} />
      ),
      flex: 1,
    },
    {
      headerName: "",
      field: "_links.self.href",
      cellRendererFramework: (params) => (
        <Button
          color="error"
          size="small"
          variant="contained"
          onClick={() => deleteCar(params.value)}
        >
          Delete
        </Button>
      ),
      flex: 1,
    },
  ];

  const deleteCar = (url) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setMessage("Car deleted successfully");
            setOpen(true);
            fetchCars();
          } else {
            alert("Something went wrong");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const addCar = (car) => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) {
          setMessage("Car added successfully");
          setOpen(true);
          fetchCars();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.error(err));
  };

  const editCar = (url, car) => {
    fetch(url, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) {
          setMessage("Car edited successfully");
          setOpen(true);
          fetchCars();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <React.Fragment>
      <AddCar addCar={addCar} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: "80%", margin: "auto" }}
      >
        <AgGridReact
          rowData={cars}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          suppressCellSelection={true}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </React.Fragment>
  );
}
