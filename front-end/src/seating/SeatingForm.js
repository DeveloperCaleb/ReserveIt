import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory, useParams } from "react-router";

function SeatingForm() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [selected, setSelected] = useState();
  const [reservation, setReservation] = useState("");
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);

  useEffect(() => {
    async function getTables() {
      try {
        await axios
          .get(`http://localhost:5001/tables`)
          .then((response) => setTables(response.data.data));
      } catch (e) {
        console.error(e);
      }
    }
    getTables();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function getReservation() {
      try {
        await axios
          .get(`http://localhost:5001/reservations/${reservation_id}`, {
            signal: abortController.signal,
          })
          .then((response) => setReservation(response.data.data));
      } catch (e) {
        console.error(e);
      }
    }
    getReservation();
    return () => {
      console.log("cleanup");
      abortController.abort(); // Cancels any pending request or response
    };
  }, [reservation_id]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelected(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(selected);
    try {
      if (selected !== "") {
        await axios
          .put(`http://localhost:5001/tables/${selected}/seat/`, {
            data: { reservation_id: reservation.reservation_id },
          })
          .then(function (response) {
            console.log(response);
          });

        await axios
          .put(`http://localhost:5001/reservations/${reservation_id}/status`, {
            data: { status: "seated" },
          })
          .then((response) => {
            console.log(response);
            history.push("/dashboard");
          });
      } else {
        setError("Please select a table.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const tableOptions = tables.map((table, index) => {
    return (
      <div key={table.table_id}>
        {table.capacity < reservation.people ||
        table.reservation_id !== null ||
        table.table_name.includes("Bar") ? (
          <option disabled value={table}>
            {table.table_name} - {table.capacity}
          </option>
        ) : (
          <option value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        )}
      </div>
    );
  });

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor="seating">
        Select a table to seat the reservation.
        <br />
        <select name="table_id" id="table_id" onChange={handleChange}>
          <option value="" disabled selected>
            Select your option
          </option>
          {tableOptions}
        </select>
        <div>
          <br />
          <p className={error !== "" ? "alert alert-danger" : ""}>
            {error !== ""} {error}
          </p>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
      </label>
    </Form>
  );
}

export default SeatingForm;
