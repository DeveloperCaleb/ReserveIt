import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

function SeatingForm() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [selected, setSelected] = useState();
  const [reservation, setReservation] = useState("");
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function getTables() {
      try {
        await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/tables`, {
            signal: abortController.signal,
          })
          .then((response) => setTables(response.data.data));
      } catch (e) {
        console.error(e);
        setApiError(e);
      }
    }
    getTables();
    return () => {
      abortController.abort(); // Cancels any pending request or response
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function getReservation() {
      try {
        await axios
          .get(
            `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservation_id}`,
            {
              signal: abortController.signal,
            }
          )
          .then((response) => setReservation(response.data.data));
      } catch (e) {
        console.error(e);
        setApiError(e);
      }
    }
    getReservation();
    return () => {
      abortController.abort(); // Cancels any pending request or response
    };
  }, [reservation_id]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelected(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (selected !== "") {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/tables/${selected}/seat/`,
          {
            data: { reservation_id: reservation_id },
          }
        );

        await axios
          .put(
            `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservation_id}/status`,
            {
              data: { status: "seated" },
            }
          )
          .then((response) => {
            history.push("/dashboard");
          });
      } else {
        setError("Please select a table.");
      }
    } catch (error) {
      console.error(error);
      setApiError(error);
    }
  };

  const tableOptions = tables.map((table, index) => {
    const isTableLargeEnough = table.capacity > reservation.people;
    const isTableOpen = table.reservation_id === null;
    const isTableABar = table.table_name.includes("Bar");

    if (isTableLargeEnough && isTableOpen && !isTableABar) {
      return (
        <option value={table.table_id} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    } else {
      return (
        <option disabled value={table} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });

  return (
    <div>
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
      <ErrorAlert error={apiError} />
    </div>
  );
}

export default SeatingForm;
